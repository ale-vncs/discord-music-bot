import { AbstractCommandStrategy } from '@modules/commandStrategy/abstract-command.strategy'

export interface StrategyFactoryData {
  alias: string[]
  strategy: AbstractCommandStrategy
}
