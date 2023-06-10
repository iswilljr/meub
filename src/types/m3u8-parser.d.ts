declare module 'm3u8-parser' {
  interface Manifest {
    targetDuration?: number
    playlists?: Playlist[]
    segments?: Segment[]
  }

  interface Attributes {
    NAME?: string
    RESOLUTION?: Resolution
  }

  interface Playlist {
    attributes: Attributes
    uri: string
  }

  interface Resolution {
    width: number
    height: number
  }

  interface Segment {
    uri: string
  }

  class Parser {
    push(str: string): void
    end(): void
    manifest: Manifest
  }
}
