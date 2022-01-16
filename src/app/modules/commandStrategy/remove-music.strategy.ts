import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RemoveMusicStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(RemoveMusicStrategy.name)
  }

  async processMessage() {
    const message = this.getMessage()
    const songIndex = this.getSongIndex(message.content)
    if (songIndex === null) {
      this.logger.error(`Index de música não permitido`)
      this.sendMessage('Index da música está inválida')
      return
    }
    this.logger.info(`Removendo musica [ ${songIndex} ] da lista`)
    const removedMusic = this.getQueue().getListSong().splice(songIndex, 1)
    this.logger.info(`Música [ ${removedMusic[0].name} ] removida com sucesso`)
    this.sendMessage(`Música [ ${removedMusic[0].name} ] removida da lista`)
  }

  private getSongIndex(text: string) {
    const page = text.split(' ')[1]
    const pageInt = parseInt(page) || -1
    return pageInt > 0 ? pageInt : null
  }
}
