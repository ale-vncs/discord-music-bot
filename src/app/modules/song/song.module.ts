import { Module } from '@nestjs/common'
import { SongManagerService } from '@modules/song/song-manager.service'
import { SongService } from '@modules/song/song.service'

@Module({
  providers: [SongService, SongManagerService],
  exports: [SongService]
})
export class SongModule {}
