import { Module } from '@nestjs/common'
import { BoundStrategy } from '@modules/commandStrategy/bound.strategy'
import { ClearStrategy } from '@modules/commandStrategy/clear.strategy'
import { DisconnectStrategy } from '@modules/commandStrategy/disconnect.strategy'
import { ForceSkipStrategy } from '@modules/commandStrategy/force-skip.strategy'
import { JoinStrategy } from '@modules/commandStrategy/join.strategy'
import { NowPlayingStrategy } from '@modules/commandStrategy/now-playing.strategy'
import { PauseStrategy } from '@modules/commandStrategy/pause.strategy'
import { PlayStrategy } from '@modules/commandStrategy/play.strategy'
import { QueueStrategy } from '@modules/commandStrategy/queue.strategy'
import { RemoveMusicStrategy } from '@modules/commandStrategy/remove-music.strategy'
import { RepeatStrategy } from '@modules/commandStrategy/repeat.strategy'
import { ResumeStrategy } from '@modules/commandStrategy/resume.strategy'
import { StrategyFactory } from '@modules/commandStrategy/strategy.factory'
import { PlaylistStrategy } from '@modules/commandStrategy/playlist.strategy'

@Module({
  providers: [
    StrategyFactory,
    BoundStrategy,
    ClearStrategy,
    DisconnectStrategy,
    ForceSkipStrategy,
    JoinStrategy,
    NowPlayingStrategy,
    PauseStrategy,
    PlayStrategy,
    QueueStrategy,
    RemoveMusicStrategy,
    RepeatStrategy,
    ResumeStrategy,
    PlaylistStrategy
  ],
  exports: [StrategyFactory]
})
export class CommandStrategyModule {}
