import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import ChannelService from '@app/services/channel.service'
import PlayMusicService from '@app/services/play-music.service'

class BomDiaStrategy extends AbstractCommand {
  private channelService = new ChannelService()
  private playMusicService = new PlayMusicService()

  async processMessage(message: Message) {
    this.channelService.setQueue(this.getQueue())
    this.playMusicService.setQueue(this.getQueue())

    this.channelService.joinChannel(message)
    this.getQueue().clearSongList()

    const logMessage = await this.playMusicService.playYouTubeMusic(
      'Bom dia',
      'https://www.youtube.com/watch?v=OcPzYcanx38',
      message.author
    )

    message.channel.send(logMessage)
  }
}

export default BomDiaStrategy
