import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsuarioRepository } from '@modules/usuarios/usuario.repository'
import { UsuarioController } from '@modules/usuarios/usuario.controller'
import { UsuarioService } from '@modules/usuarios/usuario.service'

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService],
  imports: [TypeOrmModule.forFeature([UsuarioRepository])],
  exports: [UsuarioService]
})
export class UsuarioModule {}
