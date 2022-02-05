import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PlayStrategy extends AbstractCommandStrategy<string> {
  async init() {
    this.logger.setContext(PlayStrategy.name)
  }

  async processMessage() {
    this.channelService.joinChannel()

    await this.playMusicService.searchAndPlayYoutubeMusic(this.getParam())
  }
}
