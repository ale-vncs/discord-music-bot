import { AbstractCommandStrategy } from '@modules/command/strategy/abstract-command.strategy'
import { makeCardHelp } from '@utils/card-messages.util'
import { StrategyBuilder } from '@modules/command/strategy.builder'
import { StrategyFactoryData } from '@typings/command-strategy.typing'
import { Null, Undefined } from '@typings/generic.typing'

interface HelpStrategyParams {
  page: Null<number>
}

export class HelpStrategy extends AbstractCommandStrategy<HelpStrategyParams> {
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

    return `${alias}\n${description}`
  }

  private buildDescription(description: Undefined<string>) {
    return description || 'Não possui descrição'
  }

  private buildAlias(alias: string[], params: StrategyFactoryData['params']) {
    const aliasPrefixList = alias.map((a) => this.prefix + a)

    aliasPrefixList.forEach((a, i, l) => {
      if (!params) return
      const paramsNamelist = params.map((p) => `[${p.description ?? p.name}]`)
      l[i] = `${a} ${paramsNamelist.join(' ')}`
    })

    return `\`${aliasPrefixList.join(' | ')}\``
  }

  private getPage() {
    const { page } = this.getParams()
    if (page) return page - 1
    return 0
  }
}
