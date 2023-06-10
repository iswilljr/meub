import { type Manifest, Parser } from 'm3u8-parser'

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
      playlists: parser.manifest.playlists,
      segments: parser.manifest.segments,
      targetDuration: parser.manifest.targetDuration,
    },
  }
}
