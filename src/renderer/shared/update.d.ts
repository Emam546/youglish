export type ConnectionStatus = 'receiving' | 'pause' | 'connecting' | 'completed' | 'rebuilding'
export interface DownloadingData {
  fileSize?: number
  downloaded: number
  transferRate: number
  resumeCapacity: boolean
}
export interface ProgressBarState {
  link: string
  status: ConnectionStatus
  path: string
  downloadingState?: DownloadingData
  video: {
    title: string
    previewLink: string
  }
}
export interface Context {
  curSize: number
  fileSize: number
}
export namespace ApiRender {
  interface OnMethods {
    onSpeed(speed: number): void
    onFileSize(fileSize: number): void
    onDownloaded(size: number): void
    onConnectionStatus(status: ConnectionStatus): void
    onResumeCapacity(status: boolean): void
    onEnd(): void
  }
  interface OnceMethods {}
}
export namespace Api {
  interface OnMethods {}
  interface OnceMethods {}
  interface HandleMethods {}
  interface HandleOnceMethods {}
}
