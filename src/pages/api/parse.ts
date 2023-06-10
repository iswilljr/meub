import { z } from 'zod'
import { parseM3U8 } from '@/utils/parse-m3u8'
import { zodError } from '@/utils/zod-error'
import type { NextApiRequest, NextApiResponse } from 'next'

const schema = z.object({
  url: z.string({ required_error: 'The url is required' }).trim().url(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = schema.parse(req.query)

    const { downloadable, valid, manifest } = await parseM3U8(url)

    if (!valid) throw Error('The given url must be a valid M3U8 file')

    res.send({ downloadable, manifest })
  } catch (error: any) {
    res.status(400).json({
      message: zodError(error) ?? error.message ?? 'Something went wrong, try again',
    })
  }
}
