import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnection
} from '@discordjs/voice'
import { Readable } from 'stream'
import ytdl from 'discord-ytdl-core'
import { CurrentSongData, SongData } from '@typings/queue.typing'
import { Null, Undefined } from '@typings/generic.typing'
import { StatusEnum } from '@enums/status.enum'
import { Guild } from 'discord.js'
import { getEncoderByFilterList } from '@utils/filters.util'
import { WinstonLoggerService } from '@logger/winston-logger.service'

export class SongManagerService {
  private logger = new WinstonLoggerService()

  private timeCounter: Undefined<NodeJS.Timer>
  private idleCounter: Undefined<NodeJS.Timer>

  private elapsedTime = 0
  private idleMaxTimeInSeconds = 60

  private songs: SongData[]
  private readonly player: AudioPlayer
  private stream: Null<Readable>
  private voiceChannel: Undefined<VoiceConnection>
  private status: StatusEnum
  private guild: Guild
  private repeatMode = false
  private repeatListMode = false
  private encoderArgs: Undefined<string[]>
  private isInChannel = false
  private currentSongId = 0

  constructor() {
    this.logger.setContext(SongManagerService.name)
    this.status = StatusEnum.IDLE
    this.stream = null
    this.encoderArgs = undefined
    this.songs = []
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    })

    this.player.setMaxListeners(2)

    this.player.on('stateChange', (oldState, newState) => {
      if (
        oldState.status === 'playing' &&
        newState.status === 'idle' &&
        this.isInChannel
      ) {
        if (!this.repeatMode) {
          this.skip()
        } else {
          this.play()
        }
      }
    })

    this.player.on('error', (d) => {
      this.logger.error('Error ao tocar musica: {}', this.getCurrentSong().name)
      this.logger.error('[ {} ]: {}', d.name, d.message)
      this.resetTime()
      this.skip()
    })
  }

  getStatus() {
    return this.status
  }

  setStatus(status: StatusEnum) {
    this.status = status
  }

  setVoiceChannel(connection: VoiceConnection) {
    connection.subscribe(this.player)
    this.voiceChannel = connection
  }

  disconnectVoice() {
    this.isInChannel = false
    this.clearSongList()
    this.player.stop(true)
    this.status = StatusEnum.IDLE
    this.voiceChannel?.disconnect()
  }

  clearSongList() {
    this.songs = []
    this.currentSongId = 0
  }

  getCurrentSongId() {
    return this.currentSongId
  }

  getCurrentSong(): CurrentSongData {
    return {
      ...this.songs[this.currentSongId],
      elapsedTime: this.elapsedTime
    }
  }

  getListSong() {
    return [...this.songs]
  }

  addSong(song: SongData) {
    this.logger.info(`Adicionando musica: ${song.name}`)
    this.songs.push(song)
  }

  setFilter(filters: string[]) {
    this.encoderArgs = filters
  }

  clearFilter() {
    this.encoderArgs = undefined
  }

  getFilters() {
    return this.encoderArgs
  }

  previous() {
    this.logger.info('Retornando para a música anterior')
    this.previousSong()
    this.replay()
  }

  jumpTo(songIndex: number) {
    if (songIndex > this.songs.length) songIndex = this.songs.length
    if (songIndex < 0) songIndex = 0
    this.logger.info('Pulando para a música {}', songIndex + 1)

    if (!this.repeatListMode) {
      this.songs = this.songs.slice(songIndex)
    } else {
      this.currentSongId = songIndex
    }

    this.replay()
  }

  removeByIndex(songIndex: number) {
    if (songIndex > this.songs.length || songIndex < 0) {
      throw new Error(`O index ${songIndex} não corresponde a lista de música`)
    }
    if (songIndex === this.currentSongId) {
      throw new Error('Não pode remover a música atual')
    }
    const removeSong = this.songs[songIndex]
    this.songs.splice(songIndex, 1)
    return removeSong
  }

  skip() {
    this.logger.info('Pulando para a proxima música')
    this.nextSong()
    this.replay()
  }

  play() {
    if (this.status !== StatusEnum.PLAYING) {
      if (this.songs.length) {
        this.resetIdleCounter()
        this.resetTime()
        const currentSong = this.songs[this.currentSongId]

        const stream = ytdl(currentSong.url, {
          filter: 'audioonly',
          quality: 'highestaudio',
          highWaterMark: 1 << 25,
          dlChunkSize: 0,
          encoderArgs: this.getEncoder()
        })

        const resource = createAudioResource(stream, {
          inputType: StreamType.Raw
        })

        this.stream = stream
        this.logger.info(`Tocando musica: ${currentSong.name}`)
        this.player.play(resource)
        this.status = StatusEnum.PLAYING
        this.timeCounter = setInterval(() => {
          if (currentSong.duration > this.elapsedTime) {
            this.elapsedTime++
          }
        }, 1000)
      } else {
        this.logger.info('A fila está vazia!')
        this.startIdleCounter()
      }
    }
  }

  stop() {
    this.status = StatusEnum.WAITING_MUSIC
    this.stream?.destroy()
    this.player.stop()
  }

  replay() {
    this.stop()
    this.play()
  }

  pause() {
    this.status = StatusEnum.MUSIC_PAUSED
    this.player.pause()
  }

  resume() {
    this.status = StatusEnum.PLAYING
    this.player.unpause()
  }

  toggleRepeatMode() {
    this.repeatMode = !this.repeatMode
  }

  toggleRepeatListMode() {
    this.repeatListMode = !this.repeatListMode
    if (!this.repeatListMode) {
      this.songs = this.songs.slice(this.currentSongId)
      this.currentSongId = 0
    }
  }

  getRepeatMode() {
    return this.repeatMode
  }

  clearSongInQueue() {
    this.songs.splice(1)
  }

  getGuild() {
    return this.guild
  }

  setGuild(guild: Guild) {
    this.guild = guild
  }

  setIsJoinChannel() {
    this.startIdleCounter()
    this.isInChannel = true
  }

  getIsInChannel() {
    return this.isInChannel
  }

  getIsRepeatListMode() {
    return this.repeatListMode
  }

  private getEncoder() {
    return this.encoderArgs
      ? getEncoderByFilterList(this.encoderArgs)
      : undefined
  }

  private startIdleCounter() {
    if (this.idleCounter) this.resetIdleCounter()
    this.idleCounter = setTimeout(() => {
      this.disconnectVoice()
      this.logger.info('Desconectado por inatividade')
    }, this.idleMaxTimeInSeconds * 1000)
  }

  private resetIdleCounter() {
    if (this.idleCounter) clearInterval(this.idleCounter)
  }

  private resetTime() {
    this.elapsedTime = 0
    if (this.timeCounter) clearInterval(this.timeCounter)
  }

  private nextSong() {
    if (!this.repeatListMode) {
      this.songs.shift()
    } else if (this.songs.length - 1 === this.currentSongId) {
      this.currentSongId = 0
    } else {
      this.currentSongId++
    }
  }

  private previousSong() {
    if (!this.repeatListMode) {
      const msg =
        'Função de repetição de lista não ativado, então não é possivel retornar'
      this.logger.error(msg)
      throw new Error(msg)
    } else if (this.currentSongId === 0) {
      this.currentSongId = this.songs.length - 1
    } else {
      this.currentSongId--
    }
  }
}
