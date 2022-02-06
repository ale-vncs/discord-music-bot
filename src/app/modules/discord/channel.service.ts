import { StatusEnum } from '@enums/status.enum'
import {
  DiscordGatewayAdapterCreator,
  joinVoiceChannel
} from '@discordjs/voice'
import { LoggerAbstract } from '@logger/logger.abstract'
import { Injectable } from '@nestjs/common'
import { DiscordService } from '@modules/discord/discord.service'

@Injectable()
export class ChannelService {
  constructor(
    private logger: LoggerAbstract,
    private discordCtx: DiscordService
  ) {
    logger.setContext(ChannelService.name)
  }

  joinChannel() {
    const message = this.discordCtx.getMessage()
    if (this.songManager.getIsInChannel()) {
      this.logger.warn('Já está em um canal')
      return
    }
    this.songManager.setIsJoinChannel()

    const userVoiceChannel = message.member?.voice.channel
    if (!userVoiceChannel) {
      const msg = 'Usuário não está em nenhum canal'
      this.logger.error(msg)
      this.discordCtx.sendDefaultMessage('É necessário está em um canal de voz')
      throw new Error(msg)
    }
    const guild = this.songManager.getGuild()

    this.logger.info(`Entrando no canal: ${userVoiceChannel.name}`)
    const connection = joinVoiceChannel({
      channelId: userVoiceChannel.id,
      guildId: guild.id,
      adapterCreator:
        guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator
    })

    this.songManager.setVoiceChannel(connection)
    this.songManager.setStatus(StatusEnum.WAITING_MUSIC)
  }

  isJoinChannel() {
    return this.songManager.getIsInChannel()
  }

  private get songManager() {
    return this.discordCtx.getSongManager()
  }
}
