import { User } from '@modules/user/user.entity'

interface Locals {
  token: string
  refreshToken: string
  connectionKey?: string
  user: User
  timeIni: number
}

declare module 'express' {
  export interface Response {
    locals: Locals
  }
}
