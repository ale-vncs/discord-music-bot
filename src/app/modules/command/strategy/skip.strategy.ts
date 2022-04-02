import { AbstractCommandStrategy } from './abstract-command.strategy'

export class SkipStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(SkipStrategy.name)
  }

  async processMessage() {
    const songManager = this.getSongManager()
    songManager.skip()
    const songList = songManager.getListSong()

    let msg = 'Não há mais músicas!'
    if (songList.length) {
      const songName = songManager.getCurrentSong().name
      msg = `:track_next: Próxima música é ${songName}`
    }
    this.sendMessage(msg)
  }
}
