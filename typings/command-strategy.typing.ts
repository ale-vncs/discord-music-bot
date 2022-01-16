import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'
import { LoggerAbstract } from '@logger/logger.abstract'
import { DiscordService } from '@modules/discord/discord.service'
import { ChannelService } from '@modules/discord/channel.service'
import { PlayMusicService } from '@modules/discord/play-music.service'

export interface StrategyFactoryData {
  alias: string[]
  strategy: new (
    logger: LoggerAbstract,
    discordService: DiscordService,
    channelService: ChannelService,
    playMusicService: PlayMusicService
  ) => AbstractCommandStrategy
}
