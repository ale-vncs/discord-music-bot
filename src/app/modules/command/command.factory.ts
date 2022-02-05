import { Injectable } from '@nestjs/common'
import {
  StrategyFactoryData,
  StrategyParamType
} from '@typings/command-strategy.typing'
import { LoggerAbstract } from '@logger/logger.abstract'
import { DiscordService } from '@modules/discord/discord.service'
import { PlayMusicService } from '@modules/discord/play-music.service'
import { ChannelService } from '@modules/discord/channel.service'
import { StrategyBuilder } from '@modules/command/strategy.builder'
import { Undefined } from '@typings/generic.typing'

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
      const { strategy: Strategy, params, requiredParam } = findCommand
      return new Strategy(
        this.parseParam(params, Strategy.name, requiredParam),
        this.logger,
        this.discordService,
        this.channelService,
        this.playMusicService
      )
    }

    return undefined
  }

  parseParam(
    params: Undefined<StrategyFactoryData['params']>,
    strategyName: string,
    requiredParam = true
  ) {
    const content = this.discordService.getMessageContent()
    if (!params) return undefined
    if (!content && requiredParam) {
      const msg = `É necessário os parâmetros: [ ${
        params.description ?? params.name
      } ]`
      this.discordService.sendDefaultMessage(msg)
      this.discordService.sendDefaultMessage(
        `Verifique os comandos no \`${this.discordService.getBotPrefix()}help\``
      )
      throw new Error(msg)
    }

    this.logger.info(`Construindo parâmetros de ${strategyName}`)

    const regxPattern = '(.*)'
    const regx = new RegExp(regxPattern, 'gi')
    const paramsPrimitive = regx.exec(content) ?? []
    paramsPrimitive.shift()

    this.logger.debug('Params encontrados: {}', paramsPrimitive)

    const data = this.convertByType(params.type, paramsPrimitive[0])

    this.logger.info(
      'Parâmetros adicionado no {}: [ {} ]',
      strategyName,
      JSON.stringify(data)
    )

    return data
  }

  private convertByType(type: Undefined<StrategyParamType>, value: string) {
    const converter: Record<StrategyParamType | string, (p: string) => any> = {
      number: parseInt
    }

    if (type && converter[type]) {
      return converter[type](value)
    }

    return value
  }

  checkAlias() {
    this.strategyBuilder.checkSameAlias()
  }
}
