'use client'

import { Home } from '@/components/home'
import { Download } from '@/components/download'
import { useDownloadStore } from '@/store/downloads'

export default function Page() {
  const { download } = useDownloadStore()

  return (
    <div className='mx-auto flex min-h-[calc(100vh-64px*3)] max-w-3xl items-center justify-center px-6'>
      {!download ? <Home /> : <Download {...download} />}
    </div>
  )
}
