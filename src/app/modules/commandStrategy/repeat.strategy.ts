import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RepeatStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(RepeatStrategy.name)
  }

  async processMessage() {
    this.getQueue().toggleRepeatMode()
    const msg = this.getQueue().getRepeatMode()
      ? 'Repetição ativada'
      : 'Repetição desativada'
    this.sendMessage(msg)
  }
}
