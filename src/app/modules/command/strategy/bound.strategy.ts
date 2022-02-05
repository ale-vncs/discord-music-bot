import { AbstractCommandStrategy } from './abstract-command.strategy'

export class BoundStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(BoundStrategy.name)
  }

  // TODO: falta completar esse comando
  async processMessage() {
    console.log(this.getMessage().channel)
  }
}
