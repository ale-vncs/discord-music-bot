import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'
import { getListFilterName } from '@utils/filters.util'

export class FilterListStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(FilterListStrategy.name)
  }

  async processMessage() {
    this.sendMessage(getListFilterName().join(' :small_blue_diamond: '))
  }
}
