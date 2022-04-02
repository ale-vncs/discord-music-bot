import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'

export class PreviousStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(PreviousStrategy.name)
  }

  async processMessage() {
    const songManager = this.getSongManager()
    const isRepeatListMode = songManager.getIsRepeatListMode()

    if (!isRepeatListMode) {
      this.sendMessage('Modo de repetição de lista está desativado')
      return
    }

    songManager.previous()
    const songList = songManager.getListSong()

    let msg = 'Não há mais músicas!'
    if (songList.length) {
      const songName = songManager.getCurrentSong().name
      msg = `:track_previous: Voltando para a música ${songName}`
    }

    this.sendMessage(msg)
  }
}
