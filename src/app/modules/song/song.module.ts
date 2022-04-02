import { Module } from '@nestjs/common'
import { SongService } from '@modules/song/song.service'

@Module({
  providers: [SongService],
  exports: [SongService]
})
export class SongModule {}
