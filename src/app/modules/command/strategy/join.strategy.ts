import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JoinStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(JoinStrategy.name)
  }

  async processMessage() {
    this.logger.info('Acessando informações do canal')
    const channelName = this.discordService.getChannelName()
    const isJoin = this.channelService.isJoinChannel()

    if (isJoin) {
      this.sendMessage(`Já estou no canal: ${channelName}`)
    } else {
      this.channelService.joinChannel()
      this.sendMessage(`Entrando no canal: ${channelName}`)
    }
  }
}
