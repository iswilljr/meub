import { createWithEqualityFn } from 'zustand/traditional'

export interface Download {
  url: string
  name: string
}

export type SetDownloadInput = Omit<Download, 'name'> & Partial<Pick<Download, 'name'>>

export interface DownloadState {
  download?: Download | null
  setDownload: (download: SetDownloadInput | null) => void
}

export const useDownloadStore = createWithEqualityFn<DownloadState>(set => ({
  download: null,
  setDownload: download =>
    set(state => ({
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      download: download ? { ...download, name: download.name || 'unknown' } : null,
    })),
}))
