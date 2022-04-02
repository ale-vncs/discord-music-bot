import { AbstractCommandStrategy } from './abstract-command.strategy'

export class RepeatStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(RepeatStrategy.name)
  }

  async processMessage() {
    this.getSongManager().toggleRepeatMode()
    const msg = this.getSongManager().getRepeatMode()
      ? ':repeat_one: Repetição ativada :blue_circle:'
      : ':repeat_one: Repetição desativada :red_circle:'
    this.sendMessage(msg)
  }
}
