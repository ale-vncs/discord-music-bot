import { Message } from 'discord.js'
import { StatusEnum } from '@app/enums/status.enum'
import { joinVoiceChannel } from '@discordjs/voice'
import { Logger } from '@logger'
import AbstractService from '@app/services/abstractService'

class ChannelService extends AbstractService {
  private logger = new Logger(ChannelService.name)

  joinChannel(message: Message) {
    const queue = this.getQueue()
    if (queue.getStatus() !== StatusEnum.IDLE) {
      this.logger.warn('Já está em um canal')
      return false
    }

    const userVoiceChannel = message.member?.voice.channel
    if (!userVoiceChannel) {
      this.logger.error('Usuário não está em nenhum canal')
      message.channel.send('É necessário está em um canal de voz')
      throw new Error('É necessário está em um canal de voz')
    }
    const guild = queue.getGuild()

    this.logger.info(`Entrando no canal: ${userVoiceChannel.name}`)
    const connection = joinVoiceChannel({
      channelId: userVoiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator
    })

    queue.setVoiceChannel(connection)
    queue.setStatus(StatusEnum.WAITING_MUSIC)

    return true
  }
}

export default ChannelService
