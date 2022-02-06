import { Injectable } from '@nestjs/common'
import { SongManagerService } from '@modules/song/song-manager.service'
import { QueueContextUtil } from '@utils/queue-context.util'
import { Guild } from 'discord.js'
import { ContextService } from '@context/context.service'
import { OnEvent } from '@nestjs/event-emitter'

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

  removeSongManager(key: string) {
    this.queueCtx.removeSongManager(key)
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

  @OnEvent('song-manager.disconnect')
  private handleOrderCreatedEvent(guildId: string) {
    this.removeSongManager(guildId)
  }
}
