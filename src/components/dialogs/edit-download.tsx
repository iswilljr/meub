'use client'

import { useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Button } from '@/ui/button'
import { useDownloadStore, type Download } from '@/store/downloads'
import { Input } from '@/ui/input'
import { shallow } from 'zustand/shallow'
import type { DialogProps } from '@radix-ui/react-dialog'

export interface EditDownloadDialogProps extends DialogProps {
  download: Download
}

export function EditDownloadDialog({ download, ...props }: EditDownloadDialogProps) {
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
            updateDownload({ name: inputRef.current?.value, url: download.url })
            props.onOpenChange?.(false)
          }}
        >
          <div className='flex flex-col dark:border-neutral-800'>
            <label className='mb-1 text-sm' htmlFor='name'>
              Filename:
            </label>
            <Input id='name' ref={inputRef} defaultValue={download.name} placeholder='Enter the filename' />
            <p className='mt-2 text-xs'>
              <strong>Note:</strong> <span className='text-gray-300'>don't include &quot;.mp4&quot; extension</span>
            </p>
          </div>
          <Button>Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
