import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ForceSkipStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(ForceSkipStrategy.name)
  }

  async processMessage() {
    const songList = this.getQueue().getListSong()
    this.getQueue().skip()
    const msg =
      songList.length > 0
        ? ':fast_forward: Próxima música :thumbsup:'
        : 'Não há mais músicas!'
    this.sendMessage(msg)
  }
}
