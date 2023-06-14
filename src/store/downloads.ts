import { create } from 'zustand'

export interface Download {
  url: string
  name?: string
}

export interface DownloadState {
  downloads: Download[]
  addDownload: (download: Download) => void
  removeDownloadByUrl: (url: string) => void
  updateDownload: (download: Download) => void
}

export const useDownloadStore = create<DownloadState>(set => ({
  downloads: [],
  addDownload: download =>
    set(state => {
      const downloadIndex = state.downloads.findIndex(d => d.url === download.url)
      const isDownloadInState = downloadIndex !== -1

      if (isDownloadInState) return {}

      return { downloads: [...state.downloads, download] }
    }),
  removeDownloadByUrl: url => set(state => ({ downloads: state.downloads.filter(download => download.url !== url) })),
  updateDownload: download => {
    set(state => {
      const downloadIndex = state.downloads.findIndex(d => d.url === download.url)
      const isDownloadInState = downloadIndex === -1
      console.log(isDownloadInState, downloadIndex)

      if (isDownloadInState) return {}

      const downloads = [...state.downloads]

      downloads[downloadIndex] = download

      console.log(downloads)

      return { downloads }
    })
  },
}))
