import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ClearStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(ClearStrategy.name)
  }

  async processMessage() {
    this.getSongManager().clearSongInQueue()
    this.sendMessage('A lista de música foi limpa')
  }
}
