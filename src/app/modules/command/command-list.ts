import { StrategyBuilder } from '@modules/command/strategy.builder'
import { PlayStrategy } from '@modules/command/strategy/play.strategy'
import { JoinStrategy } from '@modules/command/strategy/join.strategy'
import { NowPlayingStrategy } from '@modules/command/strategy/now-playing.strategy'
import { SkipStrategy } from '@modules/command/strategy/skip.strategy'
import { PauseStrategy } from '@modules/command/strategy/pause.strategy'
import { ResumeStrategy } from '@modules/command/strategy/resume.strategy'
import { DisconnectStrategy } from '@modules/command/strategy/disconnect.strategy'
import { QueueStrategy } from '@modules/command/strategy/queue.strategy'
import { ClearStrategy } from '@modules/command/strategy/clear.strategy'
import { RemoveMusicStrategy } from '@modules/command/strategy/remove-music.strategy'
import { RepeatStrategy } from '@modules/command/strategy/repeat.strategy'
import { PlaylistStrategy } from '@modules/command/strategy/playlist.strategy'
import { HelpStrategy } from '@modules/command/strategy/help.strategy'
import { FilterStrategy } from '@modules/command/strategy/filter.strategy'
import { FilterClearStrategy } from '@modules/command/strategy/filter-clear.strategy'
import { FilterListStrategy } from '@modules/command/strategy/filter-list.strategy'
import { FilterNowStrategy } from '@modules/command/strategy/filter-now.strategy'
import { RepeatListStrategy } from '@modules/command/strategy/repeat-list.strategy'
import { ReplayStrategy } from '@modules/command/strategy/replay.strategy'
import { PreviousStrategy } from '@modules/command/strategy/previous.strategy'
import { JumpToStrategy } from '@modules/command/strategy/jump-to.strategy'

const addCommand = StrategyBuilder.addCommand

addCommand({
  alias: ['h', 'help'],
  strategy: HelpStrategy,
  description: 'Lista de comando do Ricardo Music',
  eg: ['', '1', '2'],
  params: {
    name: 'page',
    type: 'number',
    description: 'página'
  }
})

addCommand({
  alias: ['play', 'p'],
  strategy: PlayStrategy,
  description: 'Toca a música ou adiciona na lista',
  params: {
    name: 'wordOrUrl',
    description: 'nome-ou-url-youtube',
    required: true
  }
})

addCommand({
  alias: ['s', 'skip', 'next'],
  strategy: SkipStrategy,
  description: 'Pula para a próxima música'
})

addCommand({
  alias: ['pv', 'previous', 'prev'],
  strategy: PreviousStrategy,
  description:
    'Retorna para a música anterior quando a repetição de lista está ativada'
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
  alias: ['jump-to', 'jt'],
  strategy: JumpToStrategy,
  description: 'Pular para a música selecionada',
  eg: ['1', '2'],
  params: {
    name: 'songIndex',
    description: 'posição-da-musica-na-lista',
    type: 'number',
    required: true
  }
})

addCommand({
  alias: ['dc', 'disconnect'],
  strategy: DisconnectStrategy,
  description: 'Desconecta o Ricardo da sala'
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
  alias: ['q', 'queue'],
  strategy: QueueStrategy,
  description: 'Lista as músicas que estão na lista',
  eg: ['', '1', '2'],
  params: {
    name: 'page',
    description: 'página',
    type: 'number'
  }
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
  alias: ['repeat', 'rp'],
  strategy: RepeatStrategy,
  description: 'Ativa ou desativa repetição da música atual'
})

addCommand({
  alias: ['rpl', 'repeat-list'],
  strategy: RepeatListStrategy,
  description: 'Ativa ou desativa a repetição da lista'
})

addCommand({
  alias: ['r', 'replay'],
  strategy: ReplayStrategy,
  description: 'Retoca a música atual do inicio'
})

addCommand({
  alias: ['f', 'filter'],
  strategy: FilterStrategy,
  description: 'Adiciona filtros na próxima músicas',
  eg: ['nightcore', 'fadein', 'bassboost', 'fadein bassboost'],
  params: {
    name: 'filter',
    type: 'string',
    description: 'filtro'
  }
})

addCommand({
  alias: ['fc', 'filter-clear'],
  strategy: FilterClearStrategy,
  description: 'Limpa todos os filtros aplicados'
})

addCommand({
  alias: ['fl', 'filter-list'],
  strategy: FilterListStrategy,
  description: 'Mostra todos os filtros disponíveis'
})

addCommand({
  alias: ['fn', 'filter-now'],
  strategy: FilterNowStrategy,
  description: 'Mostra os filtros aplicados'
})

addCommand({
  alias: ['playlist'],
  strategy: PlaylistStrategy,
  enabled: false
})
