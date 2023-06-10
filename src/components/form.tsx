'use client'

import { Button } from '@/ui/button'

export function Form() {
  return (
    <form className='flex items-center'>
      <input
        className='bg-secondary-8/80 focus:border-primary-6 mt-2 w-full rounded-l-full border-none bg-neutral-600/50 px-4 py-2 text-gray-300 outline-none ring-1 ring-neutral-700 duration-150 placeholder:text-neutral-500  focus:ring-2 hover:[&:not(:focus)]:ring-neutral-600'
        id='url'
        placeholder='https://example.com/my/playlist.m3u8'
      />
      <Button className='border-l-none !mt-2 rounded-full rounded-l-none'>Convert</Button>
    </form>
  )
}
