import { Message } from 'discord.js'
import ytdl from 'ytdl-core'
import { makeCardMusic } from '@utils/card-messages.util'
import ytsr from 'ytsr'
import { Injectable } from '@nestjs/common'
import { LoggerAbstract } from '@logger/logger.abstract'
import { DiscordService } from '@modules/discord/discord.service'

@Injectable()
export class PlayMusicService {
  constructor(
    private logger: LoggerAbstract,
    private discordCtx: DiscordService
  ) {
    logger.setContext(PlayMusicService.name)
  }

  async searchAndPlayYoutubeMusic(searchWordOrLink: string) {
    this.discordCtx.sendDefaultMessage(
      `:musical_note: Pesquisando :mag_right: \`${searchWordOrLink}\``
    )
    try {
      const result = await this.getYoutubeUrl(searchWordOrLink)

      if (!result) {
        this.discordCtx.sendDefaultMessage(
          '`Não foi possível encontrar referencias`'
        )
        return
      }

      const { url, search } = result

      const message = await this.playYouTubeMusic(
        search,
        url,
        this.discordCtx.getMessage().author
      )

      this.discordCtx.getMessage().channel.send(message)
    } catch (ex) {
      this.logger.error('Um error ocorreu ao buscar musica no youtube')
      this.logger.error(ex)
      this.discordCtx.sendDefaultMessage(
        'Não foi possível tocar a música desejada'
      )
    }
  }

  async playYouTubeMusic(
    search: string,
    url: string,
    author: Message['author']
  ): Promise<Parameters<Message['channel']['send']>['0']> {
    const videoInfo = (await ytdl.getBasicInfo(url)).videoDetails
    const videoTitle = videoInfo.title
    const videoChannel = videoInfo.author.name
    const videoLengthSeconds = parseInt(videoInfo.lengthSeconds)
    const totalMusicTime = this.getTotalMusicTime()

    const logMessage = makeCardMusic({
      title: videoTitle,
      musicUrl: url,
      positionInQueue: this.getSongManager().getListSong().length + 1,
      timeUntilPlaying: totalMusicTime,
      songDuration: videoLengthSeconds,
      youtubeChannelName: videoChannel,
      imageUrl: videoInfo.thumbnails[0].url,
      authorIconUrl: author.avatarURL({ size: 32 })
    })

    this.getSongManager().addSong({
      url: url,
      name: videoInfo.title,
      duration: videoLengthSeconds,
      userRequestName: author.username,
      imageUrl: videoInfo.thumbnails[0].url,
      source: 'youtube'
    })
    this.getSongManager().play()

    return {
      embeds: [logMessage]
    }
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

  async getYoutubeUrl(searchWordOrLink: string) {
    this.logger.info(`Buscando por ${searchWordOrLink}`)

    if (!searchWordOrLink) {
      this.logger.warn('Não há dados para buscar')
      return null
    }

    if (ytdl.validateURL(searchWordOrLink)) {
      return {
        url: searchWordOrLink,
        search: searchWordOrLink
      }
    }

    return await this.searchUrlYoutubeBySearch(searchWordOrLink)
  }

  private async searchUrlYoutubeBySearch(search: string) {
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

  private getSongManager() {
    return this.discordCtx.getSongManager()
  }
}
