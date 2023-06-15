import split from 'just-split'
import { useCallback, useEffect, useState } from 'react'
import { fetchFile } from '@ffmpeg/ffmpeg'
import { parseM3U8 } from '@/utils/parse-m3u8'
import { useFFmpeg } from '@/store/ffmpeg'

interface DownloaderOptions {
  url: string
}

export enum DownloadStatus {
  Idle = 'Idle',
  Loading = 'Loading',
  Parsing = 'Parsing',
  Downloading = 'Downloading',
  Converting = 'Converting',
  Success = 'Success',
  Error = 'Error',
}

export function useDownloader({ url }: DownloaderOptions) {
  const ffmpeg = useFFmpeg()
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [percentage, setPercentage] = useState(0)
  const [status, setStatus] = useState(DownloadStatus.Idle)

  const retry = useCallback(() => {
    setError(null)
    setPercentage(0)
    setStatus(DownloadStatus.Idle)
  }, [])

  useEffect(() => {
    async function download() {
      if (status !== DownloadStatus.Idle) return

      if (!ffmpeg.isLoaded()) {
        setStatus(DownloadStatus.Loading)

        await ffmpeg.load().catch(() => {
          throw Error('Failed loading FFmpeg')
        })
      }

      setStatus(DownloadStatus.Parsing)

      const parsedData = await parseM3U8(url).catch(() => {
        throw Error('Failed parsing this file. The file may be protected by CORS Policy and its unable to download.')
      })

      if (!parsedData.downloadable || !parsedData.valid) throw Error('Cannot download this M3U8 file')

      const segments = parsedData.manifest.segments?.map((segment, i) => ({ ...segment, index: i })) ?? []
      const chunks = split(segments, 10)

      const downloaded: string[] = []

      setStatus(DownloadStatus.Downloading)

      for (let i = 0; i < chunks.length; i++) {
        const segmentChunk = chunks[i]

        await Promise.allSettled(
          segmentChunk.map(async segment => {
            const fileId = `${segment.index}.ts`
            const res = await fetch(segment.uri)

            if (!res.ok) throw new Error('Failed to fetch file')

            const file = await res.blob()
            ffmpeg.FS('writeFile', fileId, await fetchFile(file))

            downloaded.push(fileId)
            const percentage = Math.floor(((segment.index + 1) / segments.length) * 100)
            setPercentage(prev => (percentage < prev ? prev : percentage))
          })
        )
      }

      setStatus(DownloadStatus.Converting)

      const downloadedIds = [...downloaded].sort((a, b) => parseInt(a.split('.')[0]) - parseInt(b.split('.')[0]))
      const concat = `concat:${downloadedIds.join('|')}`
      const args = ['-i', concat, '-c', 'copy', 'output.ts']

      await ffmpeg.run(...args).catch(() => {
        throw Error('Failed converting the video')
      })

      downloadedIds.forEach(fileId => ffmpeg.FS('unlink', fileId))

      try {
        const data = ffmpeg.FS('readFile', 'output.ts')

        const blob = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))

        setStatus(DownloadStatus.Success)
        setBlobUrl(blob)
      } catch (error) {
        throw Error('Failed converting the final result')
      }
    }

    download().catch(e => {
      setStatus(DownloadStatus.Error)
      setError(e?.message ?? 'Something went wrong')
    })
  }, [url, status, ffmpeg])

  return { blobUrl, error, retry, percentage, status }
}
