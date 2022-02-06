import { AbstractCommandStrategy } from './abstract-command.strategy'

export class DisconnectStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(DisconnectStrategy.name)
  }

  async processMessage() {
    this.logger.info('Saindo do canal')
    this.getSongManager().disconnectVoice()

    this.logger.info('Removendo songManager')
    this.discordService.removeSongManager()
  }
}
