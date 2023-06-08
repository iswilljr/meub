import { Logo } from '@/components/logo'
import { SettingsDialog } from '@/components/settings'
import { IoLogoGithub, IoLogoTwitter } from 'react-icons/io'
import Link from 'next/link'

export function Header() {
  return (
    <div className='flex w-full items-center justify-between px-6 pt-6 text-gray-400 dark:text-neutral-400'>
      <Link className='flex items-center space-x-1' href='/'>
        <Logo width={20} height={20} />
        <h1 className='font-medium'>M3U8 downloader</h1>
      </Link>
      <div className='flex items-center space-x-3'>
        <SettingsDialog />
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://twitter.com/iswilljr'
          className='text-gray-400 duration-100 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200'
        >
          <IoLogoTwitter size={20} />
        </a>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://github.com/iswilljr'
          className='text-gray-400 duration-100 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200'
        >
          <IoLogoGithub size={20} />
        </a>
      </div>
    </div>
  )
}
