import { AbstractCommandStrategy } from './abstract-command.strategy'

export class ForceSkipStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(ForceSkipStrategy.name)
  }

  async processMessage() {
    const songList = this.getSongManager().getListSong()
    this.getSongManager().skip()
    const msg =
      songList.length > 0
        ? ':fast_forward: Próxima música :thumbsup:'
        : 'Não há mais músicas!'
    this.sendMessage(msg)
  }
}
