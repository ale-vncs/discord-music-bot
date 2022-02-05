import { AbstractCommandStrategy } from './abstract-command.strategy'
import { makeCardSongList } from '@utils/card-messages.util'
import { Injectable } from '@nestjs/common'
import { Null } from '@typings/generic.typing'

@Injectable()
export class QueueStrategy extends AbstractCommandStrategy<Null<number>> {
  async init() {
    this.logger.setContext(QueueStrategy.name)
  }

  async processMessage() {
    const songlist = [...this.getSongManager().getListSong()]
    if (songlist.length) {
      const page = this.getPage()
      this.sendEmbedMessage([makeCardSongList(songlist, page)])
    } else {
      this.sendMessage('Não há músicas')
    }
  }

  private getPage() {
    const page = this.getParam()
    if (page) return page - 1
    return 0
  }
}
