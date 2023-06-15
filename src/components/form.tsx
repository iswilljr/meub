'use client'

import axios from 'redaxios'
import useSWRMutation from 'swr/mutation'
import { z } from 'zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { shallow } from 'zustand/shallow'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/ui/button'
import { PlaylistOptionsDialog, type ExtractedData, type ParsedData } from './dialogs/playlist-options'
import { useDownloadStore } from '@/store/downloads'

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
  const addDownload = useDownloadStore(state => state.setDownload, shallow)

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
    setValue,
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

        ;(isM3U8File ? parseUrl(values.url) : extractUrl(values.url))
          .then(data => {
            if (!data) return

            if ('info' in data && data.info.length === 0) {
              return setError('url', { message: 'No M3U8 files could be found in this url' })
            }

            if ('downloadable' in data && data.downloadable) {
              return addDownload({ url: values.url })
            }

            setOpen(true)
            setValue('url', '', { shouldValidate: false })
          })
          .catch(() => null)
      })}
    >
      <div className='flex items-center'>
        <input
          className='ring-border-400 mr-0.5 mt-2 w-full rounded-l-full border-none bg-neutral-200/70 px-4 py-2 outline-none ring-1 duration-150 focus:ring-2 dark:bg-neutral-600/50 dark:text-gray-300  dark:ring-neutral-700 dark:placeholder:text-neutral-500 dark:hover:[&:not(:focus)]:ring-neutral-600'
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
          <p className='text-sm text-red-700 dark:text-red-500'>{error}</p>
        </div>
      )}
      <PlaylistOptionsDialog
        parsedData={parsedUrlData}
        extractedData={extractedData}
        open={open}
        onOpenChange={setOpen}
      />
    </form>
  )
}
