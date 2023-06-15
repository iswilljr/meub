import { Form } from './form'

export function Home() {
  return (
    <div className='w-full space-y-2 py-10'>
      <section className='relative mx-auto w-fit text-center'>
        <h1 className='mx-auto text-4xl font-bold'>Download M3U8 playlists and videos</h1>
        <p className='mx-auto mt-2 max-w-md text-lg text-gray-300 sm:max-w-xl'>
          Introduce any url, select the video to download and let the magic be done.
        </p>
      </section>
      <section className='w-full'>
        <Form />
      </section>
    </div>
  )
}
