import axios from 'redaxios'
import { z } from 'zod'
import { parseM3U8 } from '@/utils/parse-m3u8'
import { zodError } from '@/utils/zod-error'
import type { NextApiRequest, NextApiResponse } from 'next'

const EXTRACTOR_URL = 'https://onlinetool.app/run/m3u8_extractor'

const schema = z.object({
  url: z.string({ required_error: 'The url is required' }).trim().url(),
})

const responseSchema = z.object({
  raw: z.array(z.string().url()),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = schema.parse(req.query)

    const body = { url, yt: 'yes' }
    const response = await axios.post(EXTRACTOR_URL, body)

    const result = responseSchema.safeParse(response.data)

    if (!result.success) {
      return res.json({ playlists: [], info: [] })
    }

    const playlists = result.data.raw.filter(url => new URL(url).pathname.replace(/\/+$/, '').endsWith('.m3u8'))
    const info = await Promise.all(playlists.map(parseM3U8))

    res.json({ playlists, info })
  } catch (error: any) {
    res.status(400).json({
      message: zodError(error) ?? error.message ?? 'Something went wrong, try again',
    })
  }
}
