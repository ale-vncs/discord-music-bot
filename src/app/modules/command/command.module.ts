import { Module } from '@nestjs/common'
import { CommandsService } from '@modules/command/commands.service'
import { SongModule } from '@modules/song/song.module'
import { CommandStrategyModule } from '@modules/commandStrategy/command-strategy.module'

@Module({
  imports: [SongModule, CommandStrategyModule],
  providers: [CommandsService],
  exports: [CommandsService]
})
export class CommandModule {}
