import { AbstractCommandStrategy } from './abstract-command.strategy'
import { makeCardSongList } from '@utils/card-messages.util'
import { Null } from '@typings/generic.typing'

export class QueueStrategy extends AbstractCommandStrategy<Null<number>> {
  async init() {
    this.logger.setContext(QueueStrategy.name)
  }

  async processMessage() {
    const songManager = this.getSongManager()
    const songlist = songManager.getListSong()
    const currentSongId = songManager.getCurrentSongId()
    if (songlist.length) {
      const page = this.getPage()
      this.sendEmbedMessage([makeCardSongList(songlist, page, currentSongId)])
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
