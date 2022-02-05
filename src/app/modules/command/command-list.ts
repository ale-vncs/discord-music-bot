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
import { HelpStrategy } from '@modules/command/strategy/help.strategy'

const addCommand = StrategyBuilder.addCommand

addCommand({
  alias: ['play', 'p'],
  strategy: PlayStrategy,
  description: 'Toca a música ou adiciona na lista',
  requiredParam: true,
  params: { name: 'wordOrUrl', description: 'nome-ou-url-youtube' }
})

addCommand({
  alias: ['join'],
  strategy: JoinStrategy,
  description: 'Convida o Ricardo para entrar na sua sala atual'
})

addCommand({
  alias: ['np', 'now-playing'],
  strategy: NowPlayingStrategy,
  description: 'Mostra informações da música atual'
})

addCommand({
  alias: ['fs', 'force-skip'],
  strategy: ForceSkipStrategy,
  description: 'Pula para a próxima música'
})

addCommand({
  alias: ['pause', 'ps'],
  strategy: PauseStrategy,
  description: 'Pausa a música atual'
})

addCommand({
  alias: ['resume', 'rs'],
  strategy: ResumeStrategy,
  description: 'Continua a reprodução da música se pausada'
})

addCommand({
  alias: ['dc', 'disconnect'],
  strategy: DisconnectStrategy,
  description: 'Desconecta o Ricardo da sala'
})

addCommand({
  alias: ['q', 'queue'],
  strategy: QueueStrategy,
  description: 'Lista as músicas que estão na lista',
  requiredParam: false,
  params: { name: 'page', description: 'página', type: 'number' }
})

addCommand({
  alias: ['clear', 'cl'],
  strategy: ClearStrategy,
  description: 'Limpa a lista de música'
})

addCommand({
  alias: ['rm', 'remove'],
  strategy: RemoveMusicStrategy,
  description: 'Remove uma música da lista',
  params: { name: 'songId', type: 'number', description: 'posição-música' }
})

addCommand({
  alias: ['repeat'],
  strategy: RepeatStrategy,
  description: 'Ativa e desativa repetição da música atual'
})

addCommand({
  alias: ['playlist'],
  strategy: PlaylistStrategy,
  enabled: false
})

addCommand({
  alias: ['h', 'help'],
  strategy: HelpStrategy,
  description: 'Lista de comando do Ricardo Music',
  requiredParam: false,
  params: { name: 'page', type: 'number', description: 'página' }
})
