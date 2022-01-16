import { Module } from '@nestjs/common'
import { InitializerService } from '@modules/initializer/initializer.service'
import { ClientModule } from '@modules/client/client.module'
import { CommandModule } from '@modules/command/command.module'

@Module({
  providers: [InitializerService],
  exports: [InitializerService],
  imports: [ClientModule, CommandModule]
})
export class InitializerModule {}
