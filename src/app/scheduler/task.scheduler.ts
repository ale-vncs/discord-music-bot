import { Injectable } from '@nestjs/common'
import { LoggerAbstract } from '@logger/logger.abstract'
import { Cron, CronExpression } from '@nestjs/schedule'
import { UsuarioService } from '@modules/usuarios/usuario.service'
import { ContextService } from '@context/context.service'

@Injectable()
export class TaskScheduler {
  constructor(
    private logger: LoggerAbstract,
    private usuarioService: UsuarioService,
    private ctx: ContextService
  ) {
    logger.setContext(TaskScheduler.name)
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.ctx.changeContext('scheduler', async () => {
      this.logger.info('Rodando scheduler')
      await this.usuarioService.getAllUser()
    })
  }
}
