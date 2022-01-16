import { Module } from '@nestjs/common'
import { ClientService } from '@modules/client/client.service'

@Module({
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}
