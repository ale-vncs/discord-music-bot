import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'

export class FilterNowStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(FilterNowStrategy.name)
  }

  async processMessage() {
    const filters = this.getSongManager().getFilters()
    if (filters) {
      this.sendMessage(filters.join(' :white_check_mark: \n'))
    } else {
      this.sendMessage('Nenhum filtro aplicado')
    }
  }
}
