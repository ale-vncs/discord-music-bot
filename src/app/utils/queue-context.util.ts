import { SongManagerService } from '@modules/song/song-manager.service'

export class QueueContextUtil {
  private static instance: QueueContextUtil
  private listQueue: Map<string, SongManagerService>

  private constructor() {
    this.listQueue = new Map<string, SongManagerService>()
  }

  static getInstance() {
    if (!QueueContextUtil.instance) {
      QueueContextUtil.instance = new QueueContextUtil()
    }
    return QueueContextUtil.instance
  }

  addSongManager(key: string, service: SongManagerService) {
    this.listQueue.set(key, service)
  }

  getQueueByKey(key: string) {
    const queue = this.getQueueOrUndefinedByKey(key)
    if (!queue) throw new Error(`Queue [ ${key} ] não encontrada`)
    return queue
  }

  getQueueOrUndefinedByKey(key: string) {
    return this.listQueue.get(key)
  }

  getListQueue() {
    return this.listQueue
  }
}
