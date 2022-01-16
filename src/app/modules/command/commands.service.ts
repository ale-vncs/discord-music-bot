import { Guild, Message } from 'discord.js'
import { AbstractCommandStrategy } from './strategy/abstract-command.strategy'
import { Undefined } from '@typings/generic.typing'
import { CommandFactory } from './command.factory'
import { Injectable } from '@nestjs/common'
import { LoggerAbstract } from '@logger/logger.abstract'
import { DiscordService } from '@modules/discord/discord.service'
import { SongService } from '@modules/song/song.service'

@Injectable()
export class CommandsService {
  private readonly prefix: string
  private message: Message

  constructor(
    private logger: LoggerAbstract,
    private discordCtx: DiscordService,
    private songService: SongService,
    private strategyFactory: CommandFactory
  ) {
    this.prefix = discordCtx.getBotPrefix()
    logger.setContext(CommandsService.name)
    strategyFactory.checkAlias()
  }

  processMessage(message: Message) {
    try {
      this.message = message
      if (this.isBotMessageAndIgnore()) return
      const { content } = message
      this.logger.info('Mensagem recebida')
      this.logger.debug('Mensagem: {}', JSON.stringify(message))
      this.logger.info(`Conteúdo da mensagem: ${content}`)

      if (!this.isValidateMessage()) return
      this.discordCtx.setMessageInContext(this.message)
      const commandAlias = this.getCommandAlias(this.prefix)
      const command = this.getCommandStrategyOrUndefined(commandAlias)
      const queue = this.getQueueByGuild()
      this.songService.setSongManagerInContext(queue)
      this.executeCommand(command)
    } catch (e) {
      this.logger.error('Um error ocorreu ao executar comando: {}', e)
    }
  }

  private executeCommand(command: Undefined<AbstractCommandStrategy>) {
    command?.init()
    command?.processMessage()
  }

  private getCommandAlias(prefix: string) {
    const command = this.message.content.split(' ')[0].replace(prefix, '')
    this.logger.info(`Comando encontrado: ${command}`)
    return command
  }

  private getCommandStrategyOrUndefined(command: string) {
    const strategy = this.strategyFactory.getStrategy(command)
    if (strategy) {
      this.logger.log(`Strategy [ ${command} ] encontrado`)
      return strategy
    }

    this.logger.warn(`Nenhum strategy encontrado!`)
    return undefined
  }

  private getQueueByGuild() {
    const guild = this.message.guild
    if (!guild) {
      throw new Error('Não uma guild vinculada a mensagem')
    }
    this.logger.debug('Guild: {}', JSON.stringify(guild))
    this.logger.info(`buscando pela songManager da guild: ${guild.name}`)

    return this.getOrCreateSongManagerByGuildId(guild)
  }

  private getOrCreateSongManagerByGuildId(guild: Guild) {
    const guildId = guild.id
    let songManager = this.songService.findSongManager(guildId)
    if (!songManager) {
      this.logger.info(
        `Nenhuma songManager encontrada, criando uma nova com guildId: ${guildId}`
      )
      songManager = this.songService.createSongManager(guild)
      this.songService.addSongManager(guildId, songManager)
    }
    return songManager
  }

  private isValidateMessage() {
    const message = this.message
    this.logger.info('Validando mensagem...')
    const validate: boolean[] = []

    validate.push(this.containPrefix(message.content))
    validate.push(this.isMessageOfUser())

    return validate.every(Boolean)
  }

  private containPrefix(text: string) {
    const containPrefix = text.startsWith(this.prefix)
    if (!containPrefix) this.logger.info('Mensagem não contem o prefixo')
    return containPrefix
  }

  private isMessageOfUser() {
    return !this.message.author.bot
  }

  private isBotMessageAndIgnore() {
    return this.discordCtx.isIgnoreBotMessage() && !this.isMessageOfUser()
  }
}
