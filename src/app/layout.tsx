import '@/styles/globals.css'
import { Slabo_13px } from 'next/font/google'
import { cx } from '@/utils/cx'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme'
import type { Metadata } from 'next'

const slabo = Slabo_13px({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--slabo-font',
})

export const metadata: Metadata = {
  title: {
    template: '%s | MEUB',
    default: 'Free M3U8 Downloader Online | MEUB',
  },
  description:
    'Download M3U8 videos from any website with this online M3U8 downloader. Insert a direct m3u8 url or extract m3u8 files from websites, then download them!',
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang='en'
      className='[-webkit-tap-highlight-color:transparent] dark:bg-neutral-900 dark:text-white'
      suppressHydrationWarning
    >
      <head>
        <link rel='icon' href='/favicon.svg' />
      </head>
      <body className={cx(slabo.className, slabo.variable)}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
