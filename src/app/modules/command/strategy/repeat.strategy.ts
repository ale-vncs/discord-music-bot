import { AbstractCommandStrategy } from './abstract-command.strategy'

export class RepeatStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(RepeatStrategy.name)
  }

  async processMessage() {
    this.getSongManager().toggleRepeatMode()
    const msg = this.getSongManager().getRepeatMode()
      ? 'Repetição ativada'
      : 'Repetição desativada'
    this.sendMessage(msg)
  }
}
