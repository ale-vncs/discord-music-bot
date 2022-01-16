import { messagesUtil, MessagesUtilKeys } from '@utils/messages.util'
import { HttpStatus } from '@nestjs/common'
import { AbstractException } from '@exceptions/abstract-exception'

export class ApiErrorException extends AbstractException {
  public status = HttpStatus.INTERNAL_SERVER_ERROR
  public readonly descriptionCode: MessagesUtilKeys
  public readonly body: any
  public readonly description: string

  constructor(
    status: HttpStatus,
    descriptionCode: MessagesUtilKeys,
    body: any
  ) {
    super(HttpStatus[status])
    this.status = status
    this.descriptionCode = descriptionCode
    this.body = body
    this.description = messagesUtil[this.descriptionCode]
  }
}
