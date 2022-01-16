import { Injectable } from '@nestjs/common'
import { StrategyFactoryData } from '@typings/command-strategy.typing'
import { LoggerAbstract } from '@logger/logger.abstract'
import { DiscordService } from '@modules/discord/discord.service'
import { PlayMusicService } from '@modules/discord/play-music.service'
import { ChannelService } from '@modules/discord/channel.service'
import { StrategyBuilder } from '@modules/command/strategy.builder'

@Injectable()
export class CommandFactory {
  private strategyBuilder = StrategyBuilder.getInstance()

  constructor(
    private logger: LoggerAbstract,
    private discordService: DiscordService,
    private playMusicService: PlayMusicService,
    private channelService: ChannelService
  ) {}

  getStrategy(command: string) {
    const list: StrategyFactoryData[] = this.strategyBuilder.getStrategyList()

    const findCommand = list.find((c) => c.alias.includes(command))

    if (findCommand) {
      const { strategy: Strategy } = findCommand
      return new Strategy(
        this.logger,
        this.discordService,
        this.channelService,
        this.playMusicService
      )
    }

    return undefined
  }
}
