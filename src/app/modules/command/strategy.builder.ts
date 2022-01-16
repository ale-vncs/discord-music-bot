import { StrategyFactoryData } from '@typings/command-strategy.typing'

export class StrategyBuilder {
  private static instance: StrategyBuilder
  private readonly listStrategy: StrategyFactoryData[]

  private constructor() {
    StrategyBuilder.instance = this
    this.listStrategy = []
    import('./command-list')
  }

  static getInstance() {
    return StrategyBuilder.instance ?? new StrategyBuilder()
  }

  static addCommand(data: StrategyFactoryData) {
    StrategyBuilder.getInstance().listStrategy.push(data)
  }

  getStrategyList() {
    return this.listStrategy.filter((s) => s.enabled || s.enabled === undefined)
  }

  checkSameAlias() {
    const aliasCheck: string[] = []

    this.getStrategyList().forEach((l) => {
      if (l.alias.some((d) => aliasCheck.includes(d))) {
        throw new Error(`${l.strategy.name} tem um alias já em uso`)
      }
      aliasCheck.push(...l.alias)
    })
  }
}
