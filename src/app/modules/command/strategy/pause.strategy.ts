import { AbstractCommandStrategy } from './abstract-command.strategy'
import { StatusEnum } from '@enums/status.enum'

export class PauseStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(PauseStrategy.name)
  }

  async processMessage() {
    if (this.getSongManager().getStatus() === StatusEnum.PLAYING) {
      this.getSongManager().pause()
      this.sendMessage(':pause_button: Musica pausada')
    }
  }
}
