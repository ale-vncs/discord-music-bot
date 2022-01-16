import { Injectable, Scope } from '@nestjs/common'
import * as winston from 'winston'
import { ContextUtil } from '@utils/context.util'
import { format } from 'date-fns'
import { Null, NullOrUndefined, Undefined } from '@typings/generic.typing'
import { LoggerAbstract } from './logger.abstract'
import { systemConfig } from '@config/system.config'
import { AppContextType, ContextKeys } from '@typings/context.typings'

const { combine, timestamp, printf, colorize } = winston.format

const colors = {
  yellow: 'yellow',
  blue: 'blue',
  green: 'green',
  red: 'red',
  grey: 'grey',
  gray: 'gray',
  cyan: 'cyan',
  black: 'black',
  white: 'white',
  magenta: 'magenta'
}

type ColorType = keyof typeof colors

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService extends LoggerAbstract {
  private readonly logger: winston.Logger
  private context: string = 'main'
  private ctx = ContextUtil.getInstance()
  private loggerParameter: Null<string>[] = []

  constructor() {
    super()
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.LOGGER_LEVEL || 'debug',
          format: combine(timestamp(), this.consoleFormat())
        })
      ],
      exitOnError: false
    })
  }

  private getRequestInfoFromContext(key: keyof ContextKeys['req']) {
    return this.ctx.getContext('req')?.[key]
  }

  private getLoggerInfoFromContext(key: keyof ContextKeys['logger']) {
    return this.ctx.getContext('logger')?.[key]
  }

  private consoleFormat() {
    return printf(({ level, message, timestamp }) => {
      this.clearLoggerParameter()
      this.insertDefaultParameter(level, timestamp)

      const selectInsertByContext: Record<
        AppContextType | string,
        Undefined<() => void>
      > = {
        api: this.insertParameterContextAPI.bind(this)
      }

      const context = this.ctx.getContext('logger')?.context

      if (context) {
        selectInsertByContext[context]?.()
      }

      return this.insertMessageAndBuild(level, message)
    })
  }

  private insertParameterContextAPI() {
    const method = this.getRequestInfoFromContext('method')
    const originalUrl = this.getRequestInfoFromContext('originalUrl')

    if (method && originalUrl) {
      this.loggerParameter.push(
        this.buildMessage(`(${method}) ${originalUrl}`, 'magenta')
      )
    }
  }

  private insertMessageAndBuild(level: string, message: string) {
    const colorByLevel = this.colorByLoggerLevel(level)

    this.loggerParameter.push('::')
    this.loggerParameter.push(this.buildMessage(message, colorByLevel, true))

    return this.loggerParameter.filter(Boolean).join('')
  }

  private insertDefaultParameter(level: string, timestamp: string) {
    const context = this.getLoggerInfoFromContext('context')
    const formatTime = format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss')
    const transactionId = this.getLoggerInfoFromContext('transactionId')
    const colorByLevel = this.colorByLoggerLevel(level)

    this.loggerParameter.push(this.buildMessage(formatTime, 'grey', true))
    this.loggerParameter.push(
      this.buildMessage(systemConfig().appName, 'yellow')
    )
    this.loggerParameter.push(this.buildMessage(context, 'yellow'))
    this.loggerParameter.push(this.buildMessage(level, colorByLevel))
    this.loggerParameter.push(this.buildMessage(this.context, 'yellow'))
    this.loggerParameter.push(this.buildMessage(transactionId, 'magenta'))
  }

  private clearLoggerParameter() {
    while (this.loggerParameter.length) this.loggerParameter.pop()
  }

  private buildMessage(
    value: NullOrUndefined<string>,
    color: ColorType,
    removeFormat = false
  ) {
    if (!value) return null
    const message = this.putColor(color, value)
    return removeFormat ? message : `[ ${message} ]`
  }

  private putColor(color: ColorType, message: string): string {
    return colorize({ colors }).colorize(color, message)
  }

  private colorByLoggerLevel(level: string): ColorType {
    const colorLevel: Record<string, ColorType> = {
      trace: 'magenta',
      input: 'grey',
      verbose: 'cyan',
      prompt: 'grey',
      debug: 'blue',
      info: 'green',
      data: 'grey',
      help: 'cyan',
      warn: 'yellow',
      error: 'red'
    }
    return colorLevel[level] ?? 'white'
  }

  debug(message: any, ...optionalParam: any[]) {
    this.logger.debug(this.buildWithOptionalParam(message, optionalParam))
  }

  verbose(message: any, ...optionalParam: any[]) {
    this.logger.verbose(this.buildWithOptionalParam(message, optionalParam))
  }

  info(message: any, ...optionalParam: any[]) {
    this.logger.info(this.buildWithOptionalParam(message, optionalParam))
  }

  error(message: any, ...optionalParam: any[]) {
    this.logger.error(this.buildWithOptionalParam(message, optionalParam))
  }

  log(msg: any) {
    this.info(msg)
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(this.buildWithOptionalParam(message, optionalParams))
  }

  setContext(context: string) {
    this.context = context
  }
}
