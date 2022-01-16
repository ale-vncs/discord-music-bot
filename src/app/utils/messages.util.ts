import { ConstraintsErrosData } from '@typings/message.typings'

export const messagesUtil = {
  routeNotFound: 'Rota não encontrada',
  //= ===========================================================================================
  badRequest: 'Erro no requisição.',
  connectionDatabaseError: 'Erro na conexão com o banco',
  unknownError: 'Um erro desconhecido ocorreu',
  requestDone: 'Requisição concluída.',
  methodNotFound: 'Método não encontrado.',
  validationError: 'Error na validação'
}

export const constraintsErrors: ConstraintsErrosData = {
  isEmail: {
    message: 'deve ser um email'
  },
  isLength: {
    message: 'deve ser maior ou igual {0} caracteres',
    regexFilterParam: '.* must be longer than or equal to (.*) characters'
  },
  isNotEmpty: {
    message: 'não deve ser vazio'
  }
}

export type ConstraintsKeys = keyof typeof constraintsErrors
export type MessagesUtilKeys = keyof typeof messagesUtil
