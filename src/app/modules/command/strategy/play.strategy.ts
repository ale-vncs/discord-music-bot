import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

interface PlayStrategyParams {
  wordOrUrl: string
}

@Injectable()
export class PlayStrategy extends AbstractCommandStrategy<PlayStrategyParams> {
  async init() {
    this.logger.setContext(PlayStrategy.name)
  }

  async processMessage() {
    this.channelService.joinChannel()

    await this.playMusicService.searchAndPlayYoutubeMusic(
      this.getParams().wordOrUrl
    )
  }
}
