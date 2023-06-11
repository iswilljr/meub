import { Form } from '@/components/form'

export default function Home() {
  return (
    <div className='mx-auto flex min-h-[calc(100vh-64px*3)] max-w-4xl items-center justify-center'>
      <div className='space-y-2 py-10'>
        <section className='relative mx-auto w-fit px-6 text-center'>
          <h1 className='mx-auto text-4xl font-bold'>Download M3U8 playlists and videos</h1>
          <p className='mx-auto mt-2 max-w-md text-lg text-gray-300 sm:max-w-xl'>
            Introduce any url, select the video to download and let the magic be done.
          </p>
        </section>
        <section className='w-full px-6'>
          <Form />
        </section>
      </div>
    </div>
  )
}
