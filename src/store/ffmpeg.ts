import { create } from 'zustand'
import { shallow } from 'zustand/shallow'
import { createFFmpeg, type FFmpeg } from '@ffmpeg/ffmpeg'

export interface DownloadState {
  ffmpeg: FFmpeg
}

export const useFFmpegStore = create<DownloadState>(set => {
  const ffmpeg = createFFmpeg({
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
    log: false,
  })

  return {
    ffmpeg,
  }
})

export function useFFmpeg() {
  return useFFmpegStore(state => state.ffmpeg, shallow)
}
