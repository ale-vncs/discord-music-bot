import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'
import { LoggerAbstract } from '@logger/logger.abstract'
import { DiscordService } from '@modules/discord/discord.service'
import { ChannelService } from '@modules/discord/channel.service'
import { PlayMusicService } from '@modules/discord/play-music.service'

export type StrategyParamType = 'string' | 'number'

export interface StrategyFactoryData {
  alias: string[]
  description?: string
  enabled?: boolean
  params?: {
    name: string
    description?: string
    type?: StrategyParamType
    required?: boolean
  }
  eg?: string[]
  strategy: new (
    params: any,
    logger: LoggerAbstract,
    discordService: DiscordService,
    channelService: ChannelService,
    playMusicService: PlayMusicService
  ) => AbstractCommandStrategy
}
