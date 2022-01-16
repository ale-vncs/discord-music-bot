import { AbstractException } from '@exceptions/abstract-exception'
import { ValidationError } from 'class-validator'
import { Undefined } from '@typings/generic.typing'
import { constraintsErrors } from '@utils/messages.util'

export class ValidationErrorException extends AbstractException {
  public erros: ValidationError[]

  constructor(errors: ValidationError[]) {
    super('validationError')
    this.erros = errors
  }

  parse() {
    const parseError: Record<string, string[]> = {}

    this.erros.forEach((err) => {
      parseError[err.property] = this.buildArrayErrors(err.constraints)
    })

    return parseError
  }

  private buildArrayErrors(constraints: Undefined<Record<string, string>>) {
    if (!constraints) return []

    const errors: string[] = []

    Object.entries(constraints).forEach(([key, value]) => {
      if (value.startsWith('*')) {
        errors.push(value.substring(1))
      } else {
        errors.push(this.parseMessageError(key, value))
      }
    })

    return errors
  }

  private parseMessageError(constraints: string, value: string) {
    let { message, regexFilterParam } = constraintsErrors[constraints]

    if (!regexFilterParam) return message

    const regex = new RegExp(regexFilterParam, 'g')

    const params = regex.exec(value)
    if (params) {
      params.shift()
      params.forEach((param, index) => {
        message = message.replace(`{${index}}`, param)
      })
    }

    return message
  }
}
