import { AbstractCommandStrategy } from './abstract-command.strategy'
import { StatusEnum } from '@enums/status.enum'

export class ResumeStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(ResumeStrategy.name)
  }

  async processMessage() {
    if (this.getSongManager().getStatus() === StatusEnum.MUSIC_PAUSED) {
      this.sendMessage(':arrow_forward: Voltando a tocar')
      this.getSongManager().resume()
    }
  }
}
