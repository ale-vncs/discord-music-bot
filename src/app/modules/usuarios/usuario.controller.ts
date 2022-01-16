import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common'
import { UsuarioService } from '@modules/usuarios/usuario.service'
import { CriarUsuarioDTO } from '@modules/usuarios/dto/criar-usuario.dto'
import { BuscarTodosUsuarioDTO } from '@modules/usuarios/dto/buscar-todos-usuario.dto'
import { ResponseApi } from '@utils/result.util'

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Get()
  async getAllUser(@Query() query: BuscarTodosUsuarioDTO, @Res() res) {
    const response = new ResponseApi(res)

    response.setBody(await this.usuarioService.getAllUser())

    return response.send()
  }

  @Post()
  async criarUsuario(@Body() body: CriarUsuarioDTO, @Res() res) {
    const response = new ResponseApi(res)

    response.setOk().setBody(body)

    return response.send()
  }
}
