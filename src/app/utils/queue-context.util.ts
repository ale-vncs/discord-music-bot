import { SongManagerService } from '@modules/song/song-manager.service'

export class QueueContextUtil {
  private static instance: QueueContextUtil
  private listQueue: Map<string, SongManagerService>

  private constructor() {
    QueueContextUtil.instance = this
    this.listQueue = new Map<string, SongManagerService>()
  }

  static getInstance() {
    return QueueContextUtil.instance ?? new QueueContextUtil()
  }

  addSongManager(key: string, service: SongManagerService) {
    this.listQueue.set(key, service)
  }

  getQueueOrUndefinedByKey(key: string) {
    return this.listQueue.get(key)
  }

  removeSongManager(key: string) {
    this.listQueue.delete(key)
  }
}
