import { LoggerService } from '@nestjs/common'

export abstract class LoggerAbstract implements LoggerService {
  abstract debug(message: any, ...optionalParams: any[]): any

  abstract error(message: any, ...optionalParams: any[]): any

  abstract log(message: any, ...optionalParams: any[]): any

  abstract verbose(message: any, ...optionalParams: any[]): any

  abstract warn(message: any, ...optionalParams: any[]): any

  abstract info(message: any, ...optionalParam: any[]): any

  abstract setContext(context: string): void

  protected buildWithOptionalParam(message: any, optionalParam: any[]) {
    if (typeof message === 'string') {
      optionalParam.forEach((param) => {
        message = message.replace('{}', param)
      })
    }
    return message
  }
}
