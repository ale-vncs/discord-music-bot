import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'
import { validateFilter } from '@utils/filters.util'

export class FilterStrategy extends AbstractCommandStrategy<string> {
  async init() {
    this.logger.setContext(FilterStrategy.name)
  }

  async processMessage() {
    const filters = this.getParam()

    const filterList = filters.split(' ')
    this.logger.info('lista de filtros: {}', filters)

    const filterValidate = validateFilter(filterList)
    this.logger.info('filtros validos: {}', filterValidate)

    if (!filterValidate.length) {
      this.logger.info('Nenhum filtro valido')
      this.sendMessage('Informe filtros validos')
      return
    }

    this.getSongManager().setFilter(filterValidate)

    this.sendMessage(
      'Filtros aplicados, terão efeitos a partir da próxima música'
    )
  }
}
