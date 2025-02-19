import { AbstractCommandStrategy } from './abstract-command.strategy'

export class PlaylistStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(PlaylistStrategy.name)
  }

  async processMessage() {
    const msg = this.getMessageContent()
    this.logger.info(msg)
    // this.playlistService.processCommand(msg)
  }
}
