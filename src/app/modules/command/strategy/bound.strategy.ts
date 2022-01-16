import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BoundStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(BoundStrategy.name)
  }

  // TODO: falta completar esse comando
  async processMessage() {
    console.log(this.getMessage().channel)
  }
}
