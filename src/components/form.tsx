'use client'

import axios from 'redaxios'
import useSWRMutation from 'swr/mutation'
import { z } from 'zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/ui/button'
import { DownloadDialog, type ExtractedData, type ParsedData } from './dialogs/download'

interface ArgOptions {
  arg: string
}

const form = z.object({
  url: z.string().url('Enter a valid url'),
})

async function requestEndpoint<T>(path: string, { arg }: ArgOptions) {
  const res = await axios.get<T>(`/${path}?url=${arg}`)
  return res.data
}

export function Form() {
  const [open, setOpen] = useState(false)

  const {
    trigger: parseUrl,
    data: parsedUrlData,
    error: parsingError,
    isMutating: isParsing,
    reset: resetParsedData,
  } = useSWRMutation('api/parse', requestEndpoint<ParsedData>)

  const {
    trigger: extractUrl,
    data: extractedData,
    error: extractingError,
    isMutating: isExtracting,
    reset: resetExtractedData,
  } = useSWRMutation('api/extract', requestEndpoint<ExtractedData>)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      url: '',
    },
    mode: 'onSubmit',
    resolver: zodResolver(form),
  })

  const error = useMemo(
    () => errors.url?.message ?? extractingError?.data?.message ?? parsingError?.data?.message,
    [errors?.url?.message, extractingError?.data?.message, parsingError?.data?.message]
  )

  return (
    <form
      onSubmit={handleSubmit(async values => {
        resetParsedData()
        resetExtractedData()

        const url = new URL(values.url)

        if (!url.protocol.startsWith('http')) {
          return setError('url', {
            message: 'Enter a valid url',
          })
        }

        const isM3U8File = url.pathname.replace(/\/+$/, '').endsWith('.m3u8')

        ;(isM3U8File ? parseUrl(values.url) : extractUrl(values.url)).then(() => setOpen(true)).catch(() => null)
      })}
    >
      <div className='flex items-center'>
        <input
          className='bg-secondary-8/80 focus:border-primary-6 mr-0.5 mt-2 w-full rounded-l-full border-none bg-neutral-600/50 px-4 py-2 text-gray-300 outline-none ring-1 ring-neutral-700 duration-150  placeholder:text-neutral-500 focus:ring-2 hover:[&:not(:focus)]:ring-neutral-600'
          id='url'
          placeholder='https://example.com/my/playlist.m3u8'
          {...register('url')}
        />
        <Button
          className='border-l-none mt-2 rounded-full rounded-l-none'
          type='submit'
          loading={isParsing || isExtracting}
        >
          Convert
        </Button>
      </div>
      {error && (
        <div className='mt-2'>
          <p className='text-sm text-red-500'>{error}</p>
        </div>
      )}
      <DownloadDialog parsedData={parsedUrlData} extractedData={extractedData} open={open} onOpenChange={setOpen} />
    </form>
  )
}
