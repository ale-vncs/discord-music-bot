import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlaylistService } from '@modules/playlist/playlist.service'
import { PlaylistRepository } from '@modules/playlist/playlist.repository'
import { PlaylistMusicRepository } from '@modules/playlist/playlist-music.repository'

@Module({
  providers: [PlaylistService],
  exports: [PlaylistService],
  imports: [
    TypeOrmModule.forFeature([PlaylistRepository, PlaylistMusicRepository])
  ]
})
export class PlaylistModule {}
