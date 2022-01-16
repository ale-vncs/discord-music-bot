import { AbstractCommandStrategy } from './abstract-command.strategy'
import { makeCardSongList } from '@utils/card-messages.util'
import { Injectable } from '@nestjs/common'
import { Null } from '@typings/generic.typing'

interface QueueStrategyParams {
  page: Null<number>
}

@Injectable()
export class QueueStrategy extends AbstractCommandStrategy<QueueStrategyParams> {
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
    const { page } = this.getParams()
    if (page) return page - 1
    return 0
  }
}
