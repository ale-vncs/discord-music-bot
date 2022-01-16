import { Injectable } from '@nestjs/common'
import { ContextService } from '@context/context.service'
import { Message } from 'discord.js'
import { makeCardMessage } from '@utils/card-messages.util'
import { SongService } from '@modules/song/song.service'

@Injectable()
export class DiscordService {
  constructor(private ctx: ContextService, private songService: SongService) {}

  getMessage() {
    return this.getDiscord().message
  }

  getMessageContent() {
    return this.getMessage().content.split(/\s(.+)/)[1]
  }

  getSongManager() {
    return this.songService.getCurrentSongManager()
  }

  removeSongManager() {
    const guildId = this.getMessage().guildId
    if (guildId) this.songService.removeSongManager(guildId)
  }

  setMessageInContext(message: Message) {
    this.ctx.setDataContext('discord', {
      message
    })
  }

  getChannelName() {
    return this.getMessage().member?.voice.channel?.name
  }

  sendDefaultMessage(text: string) {
    const msg = makeCardMessage(text)
    this.getMessage().channel.send({ embeds: [msg] })
  }

  getBotPrefix() {
    const prefix = this.ctx.getConfig('discord')?.prefix
    if (!prefix) throw new Error('Bot sem prefixo setado')
    return prefix
  }

  isIgnoreBotMessage() {
    return this.ctx.getConfig('discord')?.ignoreBotMessage ?? false
  }

  private getDiscord() {
    const discord = this.ctx.getDataContext('discord')
    if (discord) return discord
    throw new Error('Sem o contexto do discord')
  }
}
