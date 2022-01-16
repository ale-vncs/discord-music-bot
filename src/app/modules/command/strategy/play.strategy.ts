import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PlayStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(PlayStrategy.name)
  }

  async processMessage() {
    this.channelService.joinChannel()

    await this.playMusicService.searchAndPlayYoutubeMusic(
      this.getMessageContent()
    )
  }
}
