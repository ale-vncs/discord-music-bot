import * as Discord from 'discord.js'
import { ClientEvents } from 'discord.js'
import { LoggerAbstract } from '@logger/logger.abstract'
import { Injectable } from '@nestjs/common'
import { ContextService } from '@context/context.service'

@Injectable()
export class ClientService {
  private client: Discord.Client
  private botIsReady = false

  constructor(private logger: LoggerAbstract, private ctx: ContextService) {
    logger.setContext(ClientService.name)
    this.client = new Discord.Client({
      intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      ]
    })

    this.client.once('ready', (e) => {
      this.logger.log('Ready!')
      e.user.setPresence({
        activities: [{ name: 'Só as marcantes', type: 'PLAYING' }]
      })
    })

    this.client.once('reconnecting', () => {
      this.logger.log('Reconnecting!')
    })

    this.client.once('disconnect', () => {
      this.logger.log('Disconnect!')
    })

    this.client.on('debug', (error) => {
      if (process.env.BOT_DEBUG === 'true') this.logger.verbose(error)
    })

    this.client.on('shardError', (error) => {
      this.logger.error('A websocket connection encountered an error:', error)
    })
  }

  addEventOn<KEYS extends keyof Discord.ClientEvents>(
    event: KEYS,
    cb: (...args: ClientEvents[KEYS]) => void
  ) {
    this.client.on(event, cb)
  }

  async login() {
    this.logger.info('Logando bot...')
    const msg = await this.client.login(this.ctx.getConfig('discord')?.token)
    this.logger.debug(msg)
    this.logger.info(`Bot logado com sucesso, aguardando mensagens...`)
    this.botIsReady = true
  }
}
