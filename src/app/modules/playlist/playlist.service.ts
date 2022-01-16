import { LoggerAbstract } from '@logger/logger.abstract'
import { Injectable } from '@nestjs/common'
import { PlaylistRepository } from '@modules/playlist/playlist.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractPlaylist } from '@modules/playlist/playlistCommand/abstract-playlist'

@Injectable()
export class PlaylistService {
  constructor(
    private logger: LoggerAbstract,
    @InjectRepository(PlaylistRepository)
    private repository: PlaylistRepository
  ) {}

  processCommand(msg: string) {
    const { alias, payload } = this.splitAliasAndPayload(msg)
    const commandStrategy = this.getStrategyOrThrow(alias)
    commandStrategy.processMessage(payload)
  }

  private splitAliasAndPayload(msg: string) {
    return {
      alias: '',
      payload: ''
    }
  }

  private getStrategyOrThrow(commandAlias: string) {
    this.logger.info(`Buscando pelo comando: ${commandAlias}`)
    const playlistCommands: Record<string, AbstractPlaylist> = {}

    const command = playlistCommands[commandAlias]

    if (!command) {
      this.logger.error('O comando da playlist não existe')
      throw new Error('Não há um comando para a playlist')
    }

    return command
  }
}
