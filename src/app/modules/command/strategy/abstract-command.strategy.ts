import { Injectable } from '@nestjs/common'
import { DiscordService } from '@modules/discord/discord.service'
import { LoggerAbstract } from '@logger/logger.abstract'
import { ChannelService } from '@modules/discord/channel.service'
import { PlayMusicService } from '@modules/discord/play-music.service'
import { MessageOptions } from 'discord.js'

@Injectable()
export abstract class AbstractCommandStrategy<T = any> {
  constructor(
    private params: T,
    protected logger: LoggerAbstract,
    protected discordService: DiscordService,
    protected channelService: ChannelService,
    protected playMusicService: PlayMusicService
  ) {}

  abstract init(): Promise<void>

  abstract processMessage(): Promise<void>

  protected getMessage() {
    return this.discordService.getMessage()
  }

  protected getMessageContent() {
    return this.discordService.getMessageContent()
  }

  protected getSongManager() {
    return this.discordService.getSongManager()
  }

  protected sendMessage(text: string) {
    this.discordService.sendDefaultMessage(text)
  }

  protected sendEmbedMessage(embeds: MessageOptions['embeds']) {
    this.discordService.sendEmbedMessage(embeds)
  }

  protected getParams(): T {
    return this.params
  }
}
