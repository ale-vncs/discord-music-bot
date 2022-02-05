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
import { LoggerAbstract } from '@logger/logger.abstract'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SongManagerService {
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
  private encoderArgs: Undefined<string[]>

  constructor(private logger: LoggerAbstract) {
    logger.setContext(SongManagerService.name)
    this.status = StatusEnum.IDLE
    this.stream = null
    this.encoderArgs = undefined
    this.songs = []
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    })

    this.player.on('stateChange', (oldState, newState) => {
      if (oldState.status === 'playing' && newState.status === 'idle') {
        if (!this.repeatMode) {
          this.skip()
        } else {
          this.stop()
          this.play()
        }
      }
    })
  }

  init(guild: Guild) {
    this.guild = guild
    return this
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
    this.status = StatusEnum.IDLE
    this.clearSongList()
    this.stop()
    if (this.voiceChannel) return this.voiceChannel.disconnect()
  }

  clearSongList() {
    this.songs = []
  }

  getCurrentSong(): CurrentSongData {
    return {
      ...this.songs[0],
      elapsedTime: this.elapsedTime
    }
  }

  getListSong() {
    return this.songs
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

  skip() {
    this.logger.info('Pulando para a proxima música')
    this.stop()
    this.songs.shift()

    this.status = StatusEnum.WAITING_MUSIC
    this.stream = null

    this.play()
  }

  play() {
    if (this.status !== StatusEnum.PLAYING) {
      if (this.songs.length) {
        this.resetIdleCounter()
        this.resetTime()
        const currentSong = this.songs[0]

        const stream = ytdl(currentSong.url, {
          filter: 'audioonly',
          quality: 'highestaudio',
          highWaterMark: 1 << 25,
          dlChunkSize: 0,
          encoderArgs: this.encoderArgs
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

        this.player.on('error', (d) => {
          this.logger.error('Error ao tocar musica: {}', currentSong.name)
          this.logger.error('[ {} ]: {}', d.name, d.message)
          this.resetTime()
          this.skip()
        })
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

  getRepeatMode() {
    return this.repeatMode
  }

  clearSongInQueue() {
    this.songs.splice(1)
  }

  getGuild() {
    return this.guild
  }

  private startIdleCounter() {
    this.stop()
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
}
