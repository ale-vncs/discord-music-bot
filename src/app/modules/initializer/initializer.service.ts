import { Injectable } from '@nestjs/common'
import { ClientService } from '@modules/client/client.service'
import { CommandsService } from '@modules/command/commands.service'
import { LoggerAbstract } from '@logger/logger.abstract'
import { ContextService } from '@context/context.service'

@Injectable()
export class InitializerService {
  constructor(
    private logger: LoggerAbstract,
    private clientService: ClientService,
    private commandService: CommandsService,
    private ctx: ContextService
  ) {
    logger.setContext(InitializerService.name)
  }

  async start() {
    await this.clientService.login()
    this.clientService.addEventOn('messageCreate', async (message) => {
      this.ctx.changeContext('bot', () => {
        this.commandService.processMessage(message).catch((err) => {
          this.logger.error('Um error ocorreu ao processar mensagem: {}', err)
        })
      })
    })
  }
}
