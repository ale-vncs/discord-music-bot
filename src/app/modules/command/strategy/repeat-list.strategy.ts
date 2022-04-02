import { AbstractCommandStrategy } from './abstract-command.strategy'

export class RepeatListStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(RepeatListStrategy.name)
  }

  async processMessage() {
    const songManager = this.getSongManager()
    songManager.toggleRepeatListMode()
    const msg = songManager.getIsRepeatListMode()
      ? ':repeat: Repetição de lista ativada :blue_circle:'
      : ':repeat: Repetição de lista desativada :red_circle:'
    this.sendMessage(msg)
  }
}
