import { IsOptional, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'
import { Null } from '@typings/generic.typing'

export class BuscarTodosUsuarioDTO {
  @IsPositive()
  @Type(() => Number)
  page = 1

  @IsPositive()
  @Type(() => Number)
  size = 20

  @IsOptional()
  name: Null<string> = null

  @IsOptional()
  email?: string
}
