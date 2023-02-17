import { MessageOptions } from 'discord.js'
import ytdl from 'ytdl-core'
import { makeCardMusic } from '@utils/card-messages.util'
import ytsr from 'ytsr'
import spotify from 'spotify-url-info'
import fetch from 'isomorphic-unfetch'
import { Injectable } from '@nestjs/common'
import { LoggerAbstract } from '@logger/logger.abstract'
import { DiscordService } from '@modules/discord/discord.service'
import { SongData } from '@typings/queue.typing'

interface RegexProvider {
  provider: string[]
  func: (search: string) => Promise<MessageOptions['embeds']>
}

interface BuildMessage {
  title: string
  musicUrl: string
  songDuration: number
  youtubeChannelName: string
  imageUrl: string
  source: SongData['source']
}

@Injectable()
export class PlayMusicService {
  private unknownImage =
    'https://www.google.com.br/url?sa=i&url=https%3A%2F%2Fscroll.morele.net%2Ftechnologia%2Fapple-music-doczeka-sie-zmian-sugeruje-to-nowy-zakup-firmy-tima-cooka%2F&psig=AOvVaw1f4YfyCNt4WH1JCriShL--&ust=1649077690545000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCLjSlK779_YCFQAAAAAdAAAAABAJ'

  constructor(
    private logger: LoggerAbstract,
    private discordCtx: DiscordService
  ) {
    logger.setContext(PlayMusicService.name)
  }

  async searchAndPlayMusic(searchWordOrLink: string) {
    if (!searchWordOrLink) {
      this.logger.warn('Não há dados para buscar')
      return null
    }

    try {
      const regexProvider: RegexProvider[] = [
        {
          provider: ['https://open.spotify.com'],
          func: this.searchAndPlaySpotifyMusic.bind(this)
        },
        {
          provider: ['https://www.youtube.com', 'https://youtu.be'],
          func: this.searchAndPlayYoutubeMusic.bind(this)
        }
      ]

      let provider = regexProvider.find((rp) => {
        const reg = new RegExp(rp.provider + '.*')
        if (reg.test(searchWordOrLink)) return rp
        return undefined
      })

      if (!provider) {
        provider = regexProvider[1]
      }

      const message = await provider.func(searchWordOrLink)

      this.discordCtx.sendEmbedMessage(message)
    } catch (ex) {
      this.logger.error('Um error ocorreu ao buscar musica')
      this.logger.error(ex.message)
      this.discordCtx.sendDefaultMessage(
        'Não foi possível tocar a música desejada'
      )
    }
  }

  private async searchAndPlaySpotifyMusic(
    link: string
  ): Promise<MessageOptions['embeds']> {
    this.logger.info('Buscando musica do spotify')
    const songData = await spotify(fetch).getPreview(link)

    const songInfo = `${songData.title} - ${songData.artist}`

    return await this.searchAndPlayYoutubeMusic(songInfo)
  }

  private async searchAndPlayYoutubeMusic(
    searchWordOrLink: string
  ): Promise<MessageOptions['embeds']> {
    this.logger.info('Buscando musica do youtube')
    const result = await this.getYoutubeUrl(searchWordOrLink)

    if (!result) {
      this.discordCtx.sendDefaultMessage(
        '`Não foi possível encontrar referencias`'
      )
      return
    }

    const { url } = result

    return await this.playYouTubeMusic(url)
  }

  private async playYouTubeMusic(url: string) {
    const videoInfo = (await ytdl.getBasicInfo(url)).videoDetails
    const videoTitle = videoInfo.title
    const videoChannel = videoInfo.author.name
    const videoLengthSeconds = parseInt(videoInfo.lengthSeconds)

    this.logger.debug('Video info: {}', JSON.stringify(videoInfo))

    return this.addSongAndBuildMessage({
      title: videoTitle,
      musicUrl: url,
      imageUrl: videoInfo.thumbnails.length
        ? videoInfo.thumbnails[0].url
        : this.unknownImage,
      songDuration: videoLengthSeconds,
      youtubeChannelName: videoChannel,
      source: 'youtube'
    })
  }

  private getTotalMusicTime() {
    const queue = this.getSongManager()
    const listSong = [...queue.getListSong()]
    const timeOfFirstMusic = queue.getCurrentSong()
    listSong.shift()
    return (
      listSong.reduce((sum, data) => sum + data.duration, 0) +
      timeOfFirstMusic.duration -
      timeOfFirstMusic.elapsedTime
    )
  }

  private async getYoutubeUrl(searchWordOrLink: string) {
    this.logger.info(`Buscando por ${searchWordOrLink}`)

    if (ytdl.validateURL(searchWordOrLink)) {
      return {
        url: searchWordOrLink,
        search: searchWordOrLink
      }
    }

    return await this.findUrlYoutubeBySearch(searchWordOrLink)
  }

  private async findUrlYoutubeBySearch(search: string) {
    this.logger.info(`Buscando link do youtube com base em: ${search}`)
    const filters1 = await ytsr.getFilters(search)
    const filter1 = filters1.get('Type')?.get('Video')?.url
    if (!filter1) {
      return null
    }
    const firstResult = await ytsr(filter1, { limit: 1 })

    const url = (firstResult.items[0] as any).url
    this.logger.info(`Link encontrado: ${url}`)

    return {
      url,
      search
    }
  }

  private addSongAndBuildMessage(data: BuildMessage) {
    const songManager = this.getSongManager()
    this.discordCtx.sendDefaultMessage(
      `:musical_note: Pesquisando :mag_right: \`${data.title}\``
    )
    const author = this.discordCtx.getMessage().author
    const logMessage = makeCardMusic({
      title: data.title,
      musicUrl: data.musicUrl,
      positionInQueue: songManager.getListSong().length + 1,
      timeUntilPlaying: this.getTotalMusicTime(),
      songDuration: data.songDuration,
      youtubeChannelName: data.youtubeChannelName,
      imageUrl: data.imageUrl,
      authorIconUrl: author.avatarURL({ size: 32 })
    })

    songManager.addSong({
      url: data.musicUrl,
      name: data.title,
      duration: data.songDuration,
      userRequestName: author.username,
      imageUrl: data.imageUrl,
      source: data.source
    })
    songManager.play()

    return [logMessage]
  }

  private getSongManager() {
    return this.discordCtx.getSongManager()
  }
}
