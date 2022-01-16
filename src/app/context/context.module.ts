import { Global, Module } from '@nestjs/common'
import { ContextService } from './context.service'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  providers: [ContextService],
  exports: [ContextService],
  imports: [ConfigModule]
})
export class ContextModule {}
