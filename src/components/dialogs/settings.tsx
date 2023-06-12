'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { IoSettingsSharp } from 'react-icons/io5'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

export function SettingsDialog() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <IoSettingsSharp
          size={20}
          className='duration-100 hover:text-gray-500 dark:text-neutral-400 dark:hover:text-neutral-200'
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col space-y-1 dark:border-neutral-800'>
          <label className='text-sm' htmlFor='theme'>
            Theme:
          </label>
          <Select defaultValue={theme} onValueChange={setTheme}>
            <SelectTrigger className='w-full' id='theme'>
              <SelectValue placeholder='Theme' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='system'>System</SelectItem>
              <SelectItem value='dark'>Dark</SelectItem>
              <SelectItem value='light'>Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  )
}
