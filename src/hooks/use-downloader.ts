import { useCallback, useEffect, useState } from 'react'

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
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [percentage, setPercentage] = useState(0)
  const [status, setStatus] = useState(DownloadStatus.Idle)

  const retry = useCallback(() => {
    setError(null)
    setPercentage(0)
    setStatus(DownloadStatus.Idle)
  }, [])

  // TODO: Make downloader
  useEffect(() => {}, [])

  return { blobUrl, error, retry, percentage, status }
}
