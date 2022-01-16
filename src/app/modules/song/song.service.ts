import { Injectable } from '@nestjs/common'
import { SongManagerService } from '@modules/song/song-manager.service'
import { QueueContextUtil } from '@utils/queue-context.util'
import { Guild } from 'discord.js'
import { ContextService } from '@context/context.service'

@Injectable()
export class SongService {
  private queueCtx = QueueContextUtil.getInstance()

  constructor(
    private songManagerService: SongManagerService,
    private ctx: ContextService
  ) {}

  createSongManager(guild: Guild) {
    return this.songManagerService.init(guild)
  }

  addSongManager(key: string, songManager: SongManagerService) {
    this.queueCtx.addSongManager(key, songManager)
  }

  findSongManager(key: string) {
    return this.queueCtx.getQueueOrUndefinedByKey(key)
  }

  getCurrentSongManager() {
    const songManager = this.ctx.getDataContext('song')?.currentSongManager
    if (songManager) return songManager
    throw new Error('Sem SongManager no contexto')
  }

  setSongManagerInContext(songManager: SongManagerService) {
    this.ctx.setDataContext('song', {
      currentSongManager: songManager
    })
  }
}
