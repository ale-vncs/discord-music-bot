import { AbstractCommandStrategy } from './abstract-command.strategy'

export class PlayStrategy extends AbstractCommandStrategy<string> {
  async init() {
    this.logger.setContext(PlayStrategy.name)
  }

  async processMessage() {
    this.channelService.joinChannel()

    await this.playMusicService.searchAndPlayMusic(this.getParam())
  }
}
