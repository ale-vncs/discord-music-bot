import { Module } from '@nestjs/common'
import { CommandsService } from '@modules/command/commands.service'
import { SongModule } from '@modules/song/song.module'
import { CommandFactory } from '@modules/command/command.factory'

@Module({
  imports: [SongModule],
  providers: [CommandsService, CommandFactory],
  exports: [CommandsService]
})
export class CommandModule {}
