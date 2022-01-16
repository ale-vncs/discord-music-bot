import { PlayStrategy } from './play.strategy'
import { JoinStrategy } from './join.strategy'
import { NowPlayingStrategy } from './now-playing.strategy'
import { ForceSkipStrategy } from './force-skip.strategy'
import { PauseStrategy } from './pause.strategy'
import { ResumeStrategy } from './resume.strategy'
import { DisconnectStrategy } from './disconnect.strategy'
import { QueueStrategy } from './queue.strategy'
import { ClearStrategy } from './clear.strategy'
import { RemoveMusicStrategy } from './remove-music.strategy'
import { RepeatStrategy } from './repeat.strategy'
import { PlaylistStrategy } from './playlist.strategy'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { StrategyFactoryData } from '@typings/command-strategy.typing'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class StrategyFactory implements OnModuleInit {
  private playStrategy: PlayStrategy

  constructor(
    private moduleRef: ModuleRef,
    private playlistStrategy: PlaylistStrategy,
    private joinStrategy: JoinStrategy,
    private nowPlayStrategy: NowPlayingStrategy,
    private forceSkipStrategy: ForceSkipStrategy,
    private pauseStrategy: PauseStrategy,
    private resumeStrategy: ResumeStrategy,
    private disconnectStrategy: DisconnectStrategy,
    private queueStrategy: QueueStrategy,
    private clearStrategy: ClearStrategy,
    private removeMusicStrategy: RemoveMusicStrategy,
    private repeatStrategy: RepeatStrategy
  ) {}

  getStrategy(command: string) {
    const list: StrategyFactoryData[] = [
      {
        alias: ['play', 'p'],
        strategy: this.playStrategy
      },
      {
        alias: ['join'],
        strategy: this.joinStrategy
      },
      {
        alias: ['np', 'now-playing'],
        strategy: this.nowPlayStrategy
      },
      {
        alias: ['fs', 'force-skip'],
        strategy: this.forceSkipStrategy
      },
      {
        alias: ['pause', 'ps'],
        strategy: this.pauseStrategy
      },
      {
        alias: ['resume', 'rs'],
        strategy: this.resumeStrategy
      },
      {
        alias: ['dc', 'disconnect'],
        strategy: this.disconnectStrategy
      },
      {
        alias: ['q', 'queue'],
        strategy: this.queueStrategy
      },
      {
        alias: ['clear', 'c'],
        strategy: this.clearStrategy
      },
      {
        alias: ['rm', 'remove'],
        strategy: this.removeMusicStrategy
      },
      {
        alias: ['repeat'],
        strategy: this.repeatStrategy
      },
      {
        alias: ['playlist'],
        strategy: this.playlistStrategy
      }
    ]

    const findCommand = list.find((c) => c.alias.includes(command))

    return findCommand?.strategy ?? undefined
  }

  onModuleInit() {
    this.playStrategy = this.moduleRef.get(PlayStrategy)
  }
}
