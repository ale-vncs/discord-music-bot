import * as Discord from 'discord.js'
import { Logger } from '@logger'
import { ClientEvents } from 'discord.js'

class ClientService {
  private client: Discord.Client
  private logger = new Logger(ClientService.name)
  private botIsReady = false
  private readonly DISCORD_TOKEN = process.env.DISCORD_TOKEN as string

  constructor() {
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
      this.logger.verbose(error)
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

  login(cb?: () => void) {
    this.client.login(this.DISCORD_TOKEN).then((msg) => {
      this.logger.debug(msg)
      this.logger.info(`Bot logado com sucesso!!!`)
      this.botIsReady = true
      cb?.()
    })
  }
}

export default ClientService
