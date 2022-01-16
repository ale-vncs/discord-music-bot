import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

interface RemoveMusicStrategyParams {
  songId: number
}

@Injectable()
export class RemoveMusicStrategy extends AbstractCommandStrategy<RemoveMusicStrategyParams> {
  async init() {
    this.logger.setContext(RemoveMusicStrategy.name)
  }

  async processMessage() {
    const songIndex = this.getSongIndex()
    this.logger.info(`Removendo musica [ ${songIndex} ] da lista`)
    const removedMusic = this.getSongManager()
      .getListSong()
      .splice(songIndex, 1)
    this.logger.info(`Música [ ${removedMusic[0].name} ] removida com sucesso`)
    this.sendMessage(`Música [ ${removedMusic[0].name} ] removida da lista`)
  }

  private getSongIndex() {
    const { songId } = this.getParams()
    return songId
  }
}
