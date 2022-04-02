import { Injectable } from '@nestjs/common'
import { SongManagerService } from '@modules/song/song-manager.service'
import { QueueContextUtil } from '@utils/queue-context.util'
import { Guild } from 'discord.js'
import { ContextService } from '@context/context.service'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { LoggerAbstract } from '@logger/logger.abstract'

@Injectable()
export class SongService {
  private queueCtx = QueueContextUtil.getInstance()

  constructor(
    private logger: LoggerAbstract,
    private eventEmitter: EventEmitter2,
    private ctx: ContextService
  ) {
    logger.setContext(SongService.name)
  }

  createSongManager(guild: Guild) {
    const songManager = new SongManagerService(this.eventEmitter)
    songManager.setGuild(guild)
    return songManager
  }

  addSongManager(guildId: string, songManager: SongManagerService) {
    this.queueCtx.addSongManager(guildId, songManager)
  }

  removeSongManager(key: string) {
    this.queueCtx.removeSongManager(key)
  }

  findSongManager(guildId: string) {
    this.logger.info('Buscando pelo id: {}', guildId)
    this.logger.debug('Lista de guildId: {}', this.queueCtx.getListKey())
    return this.queueCtx.getQueueOrUndefinedByKey(guildId)
  }

  getCurrentSongManager() {
    const songCtx = this.ctx.getDataContext('song')
    if (songCtx) {
      const songManager = songCtx.currentSongManager
      this.logger.debug(
        'SongManager da guild id: {}',
        songManager.getGuild().id
      )
      return songManager
    }
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
