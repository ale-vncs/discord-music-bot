import { AbstractCommandStrategy } from './abstract-command.strategy'
import { StatusEnum } from '@enums/status.enum'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ResumeStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(ResumeStrategy.name)
  }

  async processMessage() {
    if (this.getQueue().getStatus() === StatusEnum.MUSIC_PAUSED) {
      this.sendMessage('Voltando a tocar')
      this.getQueue().resume()
    }
  }
}
