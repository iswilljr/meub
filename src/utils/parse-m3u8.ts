import { type Manifest, Parser } from 'm3u8-parser'
import { z } from 'zod'

function isManifestDownloadable(manifest: Manifest) {
  return (manifest.segments?.length ?? 0) > 0
}

function isValidManifest(manifest: Manifest) {
  const segmentsLength = manifest.segments?.length ?? 0
  const playlistsLength = manifest.playlists?.length ?? 0

  return segmentsLength > 0 || playlistsLength > 0
}

export async function parseM3U8(url: string) {
  const content = await fetch(url).then(res => res.text())
  const parser = new Parser()

  parser.push(content)
  parser.end()

  return {
    downloadable: isManifestDownloadable(parser.manifest),
    valid: isValidManifest(parser.manifest),
    manifest: {
      playlists:
        parser.manifest.playlists?.map(playlist => ({
          attributes: playlist.attributes,
          uri: parseUri(url, playlist.uri),
        })) ?? [],
      segments:
        parser.manifest.segments?.map(segment => ({
          uri: parseUri(url, segment.uri),
        })) ?? [],
      targetDuration: parser.manifest.targetDuration,
    },
  }
}

function parseUri(base: string, uri: string) {
  const isUrl = z.string().url().safeParse(uri).success

  if (isUrl) return uri

  const baseURL = new URL(base)
  const basePathname = baseURL.pathname.replace(/\/+$/, '').split('/').slice(0, -1).join('/')
  const pathname = `${basePathname}/${uri}`
  const parsedURL = new URL(pathname, baseURL)

  return parsedURL.toString()
}
