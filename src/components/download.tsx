'use client'

import {
  IoCheckmarkCircleOutline,
  IoCheckmarkOutline,
  IoCopyOutline,
  IoCreateOutline,
  IoDownloadOutline,
  IoRefreshOutline,
} from 'react-icons/io5'
import { useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useClipboard } from 'use-clipboard-copy'
import { cx } from '@/utils/cx'
import { Button } from '@/ui/button'
import { Tooltip } from '@/ui/tooltip'
import { DownloadStatus, useDownloader } from '@/hooks/use-downloader'
import { useDownloadStore, type Download as IDownload } from '@/store/downloads'
import { EditOrDownloadDialog } from './dialogs/download'

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
  const clipboard = useClipboard({ copiedTimeout: 1000 })
  const setDownload = useDownloadStore(state => state.setDownload, shallow)
  const [isDownloadOpen, setDownloadOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)

  const { blobUrl, error, retry, percentage, status } = useDownloader({ url })

  const percentageStr = useMemo(() => {
    const n = status === DownloadStatus.Error ? 0 : percentage

    return `${n}%`
  }, [percentage, status])

  return (
    <div className='w-full items-center space-y-2'>
      <div className='relative flex w-full flex-col gap-2'>
        <div className='relative'>
          <div className='flex items-start gap-1'>
            <h2 className='line-clamp-1 break-all text-lg font-semibold'>{`${name}.mp4`}</h2>
            <Tooltip content='Edit Download'>
              <button aria-label='Edit Download' onClick={() => setEditOpen(true)}>
                <IoCreateOutline size={16} />
              </button>
            </Tooltip>
          </div>
          <div className='flex items-start gap-1'>
            <p className='line-clamp-1 break-all text-sm text-gray-600 dark:text-gray-200'>{url}</p>
            <Tooltip content='Copy URL'>
              <button aria-label='Copy URL' onClick={() => clipboard.copy(url)}>
                {clipboard.copied ? (
                  <IoCheckmarkOutline className='text-green-700 dark:text-green-500' size={12} />
                ) : (
                  <IoCopyOutline size={12} />
                )}
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
            onClick={() => setDownloadOpen(true)}
          >
            Export
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
      <EditOrDownloadDialog type='edit' open={isEditOpen} onOpenChange={setEditOpen} download={{ name, url }} />
      <EditOrDownloadDialog
        type='download'
        url={blobUrl}
        open={isDownloadOpen}
        onOpenChange={setDownloadOpen}
        download={{ name, url }}
      />
    </div>
  )
}
