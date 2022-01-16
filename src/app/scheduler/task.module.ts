import { Module } from '@nestjs/common'
import { TaskScheduler } from './task.scheduler'
import { UsuarioModule } from '@modules/usuarios/usuario.module'

@Module({
  providers: [TaskScheduler],
  imports: [UsuarioModule]
})
export class TaskModule {}
