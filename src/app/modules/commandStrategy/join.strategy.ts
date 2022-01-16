import { AbstractCommandStrategy } from './abstract-command.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JoinStrategy extends AbstractCommandStrategy {
  async init() {
    this.logger.setContext(JoinStrategy.name)
  }

  async processMessage() {
    this.logger.info('Acessando informações do canal')
    this.channelService.joinChannel()
    const isJoin = this.channelService.isJoinChannel()
    const channelName = this.discordService.getChannelName()
    const msg = isJoin
      ? `Entrando no canal: ${channelName}`
      : `Já estou no canal: ${channelName}`
    this.sendMessage(msg)
  }
}
