import { AbstractCommandStrategy } from './abstract-command.strategy'

export class RemoveMusicStrategy extends AbstractCommandStrategy<number> {
  async init() {
    this.logger.setContext(RemoveMusicStrategy.name)
  }

  async processMessage() {
    const songIndex = this.getSongIndex() - 1
    const songManager = this.getSongManager()
    const songListLength = songManager.getListSong().length

    if (songIndex > songListLength || songIndex < 0) {
      this.sendMessage(
        `Escolha um número de 1 à ${songListLength} para remover`
      )
      return
    }

    if (songIndex === songManager.getCurrentSongId()) {
      this.sendMessage(`Não pode remover a múscia atual`)
      return
    }

    this.logger.info(`Removendo musica [ ${songIndex + 1} ] da lista`)
    const removedMusic = this.getSongManager().removeByIndex(songIndex)
    this.logger.info(`Música [ ${removedMusic.name} ] removida com sucesso`)
    this.sendMessage(`Música [ ${removedMusic.name} ] removida da lista`)
  }

  private getSongIndex() {
    return this.getParam()
  }
}
