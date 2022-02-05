import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'
import { makeCardHelp } from '@utils/card-messages.util'
import { StrategyBuilder } from '@modules/command/strategy.builder'
import { StrategyFactoryData } from '@typings/command-strategy.typing'
import { Null, Undefined } from '@typings/generic.typing'

export class HelpStrategy extends AbstractCommandStrategy<Null<number>> {
  private prefix: string

  async init() {
    this.logger.setContext(HelpStrategy.name)
    this.prefix = this.discordService.getBotPrefix()
  }

  async processMessage() {
    const card = makeCardHelp(this.makeCommandDescription(), this.getPage())
    this.sendEmbedMessage([card])
  }

  private makeCommandDescription() {
    const descriptions: string[] = []

    const commandList = StrategyBuilder.getInstance().getStrategyList()

    commandList.forEach((comm) => {
      descriptions.push(this.makeDescription(comm))
    })

    return descriptions
  }

  private makeDescription(comm: StrategyFactoryData) {
    const alias = this.buildAlias(comm.alias, comm.params)
    const description = this.buildDescription(comm.description)
    const examples = this.buildExample(comm.alias[0], comm.eg)

    const build = [alias, description, examples].filter(Boolean)

    return build.join('\n')
  }

  private buildExample(alias: string, eg: Undefined<string[]>) {
    if (!eg) return undefined
    const build = eg.map((e) => `${this.prefix}${alias} ${e}`)
    return `ex: ${build.join('\n ex: ')}`
  }

  private buildDescription(description: Undefined<string>) {
    return description || 'Não possui descrição'
  }

  private buildAlias(alias: string[], params: StrategyFactoryData['params']) {
    const aliasPrefixList = alias.map((a) => this.prefix + a)

    aliasPrefixList.forEach((a, i, l) => {
      if (!params) return
      const paramsNamelist = `[${params.description ?? params.name}]`
      l[i] = `${a} ${paramsNamelist}`
    })

    return `\`${aliasPrefixList.join(' | ')}\``
  }

  private getPage() {
    const page = this.getParam()
    if (page) return page - 1
    return 0
  }
}
