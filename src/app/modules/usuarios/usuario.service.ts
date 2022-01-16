import { Injectable } from '@nestjs/common'
import { LoggerAbstract } from '@logger/logger.abstract'
import { InjectRepository } from '@nestjs/typeorm'
import { UsuarioRepository } from '@modules/usuarios/usuario.repository'
import { ContextService } from '@context/context.service'
import { Usuario } from '@modules/usuarios/usuario.entity'

@Injectable()
export class UsuarioService {
  constructor(
    private logger: LoggerAbstract,
    private ctx: ContextService,
    @InjectRepository(UsuarioRepository)
    private repository: UsuarioRepository
  ) {
    this.logger.setContext(UsuarioService.name)
  }

  async getAllUser() {
    return await this.repository.find()
  }

  async createUser() {
    return new Usuario()
  }
}
