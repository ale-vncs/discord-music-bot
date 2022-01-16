import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class CriarUsuarioDTO {
  @IsEmail()
  email: string

  @IsNotEmpty()
  @Length(3)
  name: string
}
