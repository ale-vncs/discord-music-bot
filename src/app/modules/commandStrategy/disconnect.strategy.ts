import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DisconnectStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(DisconnectStrategy.name)
  }

  async processMessage() {
    this.getQueue().disconnectVoice()
  }
}
