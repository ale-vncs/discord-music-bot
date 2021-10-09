import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import ChannelService from '@app/services/channel.service'
import PlayMusicService from '@app/services/play-music.service'

class PlayStrategy extends AbstractCommand {
  private channelService = new ChannelService()
  private playMusicService = new PlayMusicService()

  async processMessage(message: Message) {
    this.playMusicService.setQueue(this.getQueue())
    this.channelService.setQueue(this.getQueue())

    this.channelService.joinChannel(message)
    const result = await this.playMusicService.getYoutubeUrl(message.content)

    if (!result) {
      this.sendMessage('`Não foi possivel encontrar referencias`')
      return
    }

    const { url, search } = result
    this.sendMessage(`:musical_note: Pesquisando :mag_right: \`${search}\``)

    const logMessage = await this.playMusicService.playYouTubeMusic(
      search,
      url,
      message.author
    )
    message.channel.send(logMessage)
  }
}

export default PlayStrategy
