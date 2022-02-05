import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'

export class FilterClearStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(FilterClearStrategy.name)
  }

  async processMessage() {
    this.logger.info('Limpando filtros')
    this.getSongManager().clearFilter()
    this.sendMessage(
      'Filtros removidos, serão aplicados a partir da próxima música'
    )
  }
}
