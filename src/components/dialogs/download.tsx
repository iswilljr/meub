'use client'

import { useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Button } from '@/ui/button'
import { useDownloadStore, type Download } from '@/store/downloads'
import { Input } from '@/ui/input'
import { shallow } from 'zustand/shallow'
import type { DialogProps } from '@radix-ui/react-dialog'

type DownloadType = 'download' | 'edit'

export interface EditDownloadDialogProps extends DialogProps {
  type: DownloadType
  download: Download
  url?: string | null
}

export function EditOrDownloadDialog({ download, type, url, ...props }: EditDownloadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const updateDownload = useDownloadStore(state => state.setDownload, shallow)

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download File Settings</DialogTitle>
        </DialogHeader>
        <form
          className='flex flex-col gap-4'
          onSubmit={e => {
            e.preventDefault()
            const name = inputRef.current?.value

            if (type === 'edit') {
              updateDownload({ name, url: download.url })
            }

            if (type === 'download' && url) {
              const anchor = document.createElement('a')

              anchor.hidden = true
              anchor.className = 'sr-only'
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              anchor.download = `${name || download.name}.mp4`
              anchor.href = url

              document.body.appendChild(anchor)
              anchor.click()
              anchor.remove()
            }

            props.onOpenChange?.(false)
          }}
        >
          <div className='flex flex-col dark:border-neutral-800'>
            <label className='mb-1 text-sm' htmlFor='name'>
              Filename:
            </label>
            <Input id='name' ref={inputRef} defaultValue={download.name} placeholder='Enter the filename' />
            <p className='mt-2 text-xs'>
              <strong>Note:</strong>{' '}
              <span className='text-gray-700 dark:text-gray-300'>don't include &quot;.mp4&quot; extension</span>
            </p>
          </div>
          <Button>{type === 'edit' ? 'Update' : 'Download'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
