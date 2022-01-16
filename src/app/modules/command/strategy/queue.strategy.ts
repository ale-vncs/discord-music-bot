import { AbstractCommandStrategy } from './abstract-command.strategy'
import { makeCardSongList } from '@utils/card-messages.util'
import { Injectable } from '@nestjs/common'

@Injectable()
export class QueueStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(QueueStrategy.name)
  }

  async processMessage() {
    const message = this.getMessage()
    const songlist = [...this.getSongManager().getListSong()]
    if (songlist.length) {
      const page = this.getPage(message.content)
      this.sendEmbedMessage([makeCardSongList(songlist, page)])
    } else {
      this.sendMessage('Não há músicas')
    }
  }

  private getPage(text: string) {
    const page = text.split(' ')[1]
    const pageInt = parseInt(page) || 0
    return pageInt > 0 ? pageInt - 1 : 0
  }
}
