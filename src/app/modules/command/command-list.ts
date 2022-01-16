import { StrategyBuilder } from '@modules/command/strategy.builder'
import { PlayStrategy } from '@modules/command/strategy/play.strategy'
import { JoinStrategy } from '@modules/command/strategy/join.strategy'
import { NowPlayingStrategy } from '@modules/command/strategy/now-playing.strategy'
import { ForceSkipStrategy } from '@modules/command/strategy/force-skip.strategy'
import { PauseStrategy } from '@modules/command/strategy/pause.strategy'
import { ResumeStrategy } from '@modules/command/strategy/resume.strategy'
import { DisconnectStrategy } from '@modules/command/strategy/disconnect.strategy'
import { QueueStrategy } from '@modules/command/strategy/queue.strategy'
import { ClearStrategy } from '@modules/command/strategy/clear.strategy'
import { RemoveMusicStrategy } from '@modules/command/strategy/remove-music.strategy'
import { RepeatStrategy } from '@modules/command/strategy/repeat.strategy'
import { PlaylistStrategy } from '@modules/command/strategy/playlist.strategy'

const addStrategy = StrategyBuilder.addCommand

addStrategy({
  alias: ['play', 'p'],
  strategy: PlayStrategy
})

addStrategy({
  alias: ['join'],
  strategy: JoinStrategy
})

addStrategy({
  alias: ['np', 'now-playing'],
  strategy: NowPlayingStrategy
})

addStrategy({
  alias: ['fs', 'force-skip'],
  strategy: ForceSkipStrategy
})

addStrategy({
  alias: ['pause', 'ps'],
  strategy: PauseStrategy
})

addStrategy({
  alias: ['resume', 'rs'],
  strategy: ResumeStrategy
})

addStrategy({
  alias: ['dc', 'disconnect'],
  strategy: DisconnectStrategy
})

addStrategy({
  alias: ['q', 'queue'],
  strategy: QueueStrategy
})

addStrategy({
  alias: ['clear', 'c'],
  strategy: ClearStrategy
})

addStrategy({
  alias: ['rm', 'remove'],
  strategy: RemoveMusicStrategy
})

addStrategy({
  alias: ['repeat'],
  strategy: RepeatStrategy
})

addStrategy({
  alias: ['playlist'],
  strategy: PlaylistStrategy
})
