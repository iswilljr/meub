'use client'

import {
  IoCheckmarkCircleOutline,
  IoCopyOutline,
  IoCreateOutline,
  IoDownloadOutline,
  IoRefreshOutline,
} from 'react-icons/io5'
import { useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { cx } from '@/utils/cx'
import { Button } from '@/ui/button'
import { Tooltip } from '@/ui/tooltip'
import { DownloadStatus, useDownloader } from '@/hooks/use-downloader'
import { useDownloadStore, type Download as IDownload } from '@/store/downloads'
import { EditDownloadDialog } from './dialogs/edit-download'

export interface DownloadProps extends IDownload {}

export const statusMessages: Record<DownloadStatus, string> = {
  [DownloadStatus.Idle]: 'Starting...',
  [DownloadStatus.Loading]: 'Loading FFmpeg...',
  [DownloadStatus.Parsing]: 'Parsing...',
  [DownloadStatus.Downloading]: 'Downloading...',
  [DownloadStatus.Converting]: 'Converting...',
  [DownloadStatus.Success]: 'Downloaded',
  [DownloadStatus.Error]: '[ERROR]: %s',
}

export function Download({ url, name }: DownloadProps) {
  const setDownload = useDownloadStore(state => state.setDownload, shallow)
  const [open, setOpen] = useState(false)
  const { blobUrl, error, retry, percentage, status } = useDownloader({ url })

  const percentageStr = useMemo(() => {
    const n = status === DownloadStatus.Error ? 0 : status === DownloadStatus.Success ? 100 : percentage

    return `${n}%`
  }, [percentage, status])

  return (
    <div className='w-full items-center space-y-2'>
      <div className='relative flex w-full flex-col gap-2'>
        <div className='relative'>
          <div className='flex items-start gap-1'>
            <h2 className='line-clamp-1 break-all text-lg font-semibold'>{`${name}.mp4`}</h2>
            <Tooltip content='Edit Download'>
              <button aria-label='Edit Download' onClick={() => setOpen(true)}>
                <IoCreateOutline size={16} />
              </button>
            </Tooltip>
          </div>
          <div className='flex items-start gap-1'>
            <p className='line-clamp-1 break-all text-sm text-gray-600 dark:text-gray-200'>{url}</p>
            <Tooltip content='Copy URL'>
              <button aria-label='Copy URL'>
                <IoCopyOutline size={12} />
              </button>
            </Tooltip>
          </div>
          <p
            className={cx('mt-1 flex items-start gap-1 text-xs text-gray-500 dark:text-gray-400', {
              'text-green-700 dark:text-green-500': status === DownloadStatus.Success,
              'text-red-700 dark:text-red-500': status === DownloadStatus.Error,
            })}
          >
            {statusMessages[status].replace(
              '%s',
              status === DownloadStatus.Error ? error ?? 'Something went wrong' : ''
            )}
            {status === DownloadStatus.Success && (
              <span>
                <IoCheckmarkCircleOutline size={14} />
              </span>
            )}
          </p>
        </div>
        <div className='flex w-full items-center gap-1'>
          <div role='progressbar' className='relative h-4 flex-1 overflow-hidden rounded-full bg-neutral-600/30'>
            <span
              className='pointer-events-none absolute left-0 top-0 h-full w-0 bg-green-600 duration-1000'
              style={{ width: percentageStr }}
            />
          </div>
          <span className='text-sm'>
            <strong>{percentageStr}</strong>
          </span>
        </div>
      </div>

      <div className='flex flex-col items-center gap-2 text-sm  md:flex-row'>
        {status === DownloadStatus.Error ? (
          <Button className='w-full' aria-label='Retry' icon={<IoRefreshOutline size={16} />} onClick={() => retry()}>
            Retry
          </Button>
        ) : (
          <Button
            className='w-full'
            aria-label='Download File'
            icon={<IoDownloadOutline size={16} />}
            disabled={!blobUrl}
            onClick={() => {
              if (!blobUrl) return

              const anchor = document.createElement('a')

              anchor.hidden = true
              anchor.className = 'sr-only'
              anchor.download = `${name}.mp4`
              anchor.href = blobUrl

              document.body.appendChild(anchor)
              anchor.click()
              anchor.remove()
            }}
          >
            Download
          </Button>
        )}

        <Button
          className='w-full'
          aria-label='Retry'
          icon={<IoRefreshOutline size={16} />}
          onClick={() =>
            status === DownloadStatus.Success || status === DownloadStatus.Error || status === DownloadStatus.Idle
              ? setDownload(null)
              : window.location.reload()
          }
        >
          Download Another
        </Button>
      </div>
      <EditDownloadDialog open={open} onOpenChange={setOpen} download={{ name, url }} />
    </div>
  )
}
