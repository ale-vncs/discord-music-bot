import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'

export class ReplayStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(ReplayStrategy.name)
  }

  async processMessage() {
    const songManager = this.getSongManager()
    const songList = songManager.getListSong()
    let msg = 'Não há mais músicas!'
    if (songList.length) {
      songManager.replay()
      msg = ':arrows_counterclockwise: Replay música :thumbsup:'
    }

    this.sendMessage(msg)
  }
}
