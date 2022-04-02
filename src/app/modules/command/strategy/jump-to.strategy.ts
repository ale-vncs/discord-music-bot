import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'

export class JumpToStrategy extends AbstractCommandStrategy<number> {
  async init() {
    this.logger.setContext(JumpToStrategy.name)
  }

  async processMessage() {
    const songIndex = this.getParam() - 1

    const songManager = this.getSongManager()
    const songList = songManager.getListSong()

    let msg = 'Não há mais músicas!'
    if (songList.length) {
      songManager.jumpTo(songIndex)
      const songName = songManager.getCurrentSong().name
      msg = `:arrow_right_hook: Pulando para a música ${songName}`
    }
    this.sendMessage(msg)
  }
}
