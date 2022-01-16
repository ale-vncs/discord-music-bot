import { AbstractCommandStrategy } from './abstract-command.strategy'
import { makeCardNowPlaying } from '@utils/card-messages.util'
import { StatusEnum } from '@enums/status.enum'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NowPlayingStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(NowPlayingStrategy.name)
  }

  async processMessage(): Promise<void> {
    const status = this.getSongManager().getStatus()
    if (status === StatusEnum.PLAYING) {
      const songData = this.getSongManager().getCurrentSong()

      const logMessage = makeCardNowPlaying(songData)
      this.getMessage().channel.send({ embeds: [logMessage] })
      return
    }
    this.sendMessage('Nenhuma música tocando no momento')
  }
}
