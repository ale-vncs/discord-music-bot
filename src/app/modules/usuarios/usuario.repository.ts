import { EntityRepository, Repository } from 'typeorm'
import { Usuario } from '@modules/usuarios/usuario.entity'

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {}
