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

  addSongManager(guildId: string, service: SongManagerService) {
    this.listQueue.set(guildId, service)
  }

  getQueueOrUndefinedByKey(guildId: string) {
    return this.listQueue.get(guildId)
  }

  removeSongManager(key: string) {
    this.listQueue.delete(key)
  }

  getListKey() {
    return Array.from(this.listQueue.keys())
  }
}
