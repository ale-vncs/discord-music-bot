import { Global, Module } from '@nestjs/common'
import { DiscordService } from '@modules/discord/discord.service'
import { PlayMusicService } from '@modules/discord/play-music.service'
import { ChannelService } from '@modules/discord/channel.service'
import { SongModule } from '@modules/song/song.module'

@Global()
@Module({
  providers: [DiscordService, PlayMusicService, ChannelService],
  exports: [DiscordService, PlayMusicService, ChannelService],
  imports: [SongModule]
})
export class DiscordModule {}
