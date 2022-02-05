import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException
} from '@nestjs/common'
import { ApiErrorException } from '@exceptions/api-error.exception'
import { Response } from 'express'
import { Null } from '@typings/generic.typing'
import { ResponseApi } from '@utils/result.util'
import { ValidationErrorException } from '@exceptions/validation-error.exception'
import { LoggerAbstract } from '@logger/logger.abstract'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private response: Null<Response> = null

  constructor(private logger: LoggerAbstract) {
    logger.setContext(AllExceptionsFilter.name)
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    this.response = response

    this.logger.error(exception)
    this.logger.error(exception.stack)

    const exceptionList: Record<string, (ex: any) => void> = {
      ApiErrorException: this.apiErrorException,
      NotFoundException: this.notFoundException,
      ValidationErrorException: this.classValidationException
    }

    const execFuncException = exceptionList[exception.name] ?? null

    if (execFuncException) {
      return execFuncException.bind(this)(exception)
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    return this.buildResponse()
      .setStatus(status)
      .setCode('unknownError')
      .setBody({ path: request.url, message: exception.message })
      .send()
  }

  private apiErrorException(exception: ApiErrorException) {
    this.logger.error(
      `${exception.descriptionCode} - {}`,
      exception.description
    )
    const response = this.buildResponse()
    return response
      .setStatus(exception.status)
      .setCode(exception.descriptionCode)
      .setBody(exception.body)
      .send()
  }

  private notFoundException(exception: NotFoundException) {
    const response = this.buildResponse()
    return response
      .setStatus(HttpStatus.NOT_FOUND)
      .setCode('routeNotFound')
      .setBody(exception.message)
      .send()
  }

  private classValidationException(exception: ValidationErrorException) {
    const response = this.buildResponse()
    this.logger.error(exception.erros)

    return response
      .setStatus(HttpStatus.BAD_REQUEST)
      .setCode('validationError')
      .setBody(exception.parse())
      .send()
  }

  private getResponse() {
    if (this.response) {
      return this.response
    }
    throw new Error('Sem response')
  }

  private buildResponse() {
    return new ResponseApi(this.getResponse())
  }
}
