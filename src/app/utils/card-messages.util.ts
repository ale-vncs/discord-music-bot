import { MessageEmbedOptions } from 'discord.js'
import { CardMusic } from '@typings/card-message.typing'
import { CurrentSongData, SongData } from '@typings/queue.typing'
import { secondsToDisplayTime } from './converts.util'

const makeCardMessage = (msg: string) => {
  const logMessage: MessageEmbedOptions = {
    description: msg,
    color: '#b425d4'
  }

  return logMessage
}

const makeCardMusic = (data: CardMusic) => {
  const logMessage: MessageEmbedOptions = {
    title: data.title,
    color: data.color ?? '#0088ff',
    author: {
      name: 'Adicionou na fila',
      iconURL: data.authorIconUrl ?? undefined,
      proxyIconURL: data.imageUrl
    },
    url: data.musicUrl,
    thumbnail: {
      url: data.imageUrl
    },
    fields: [
      {
        name: 'Canal Youtube',
        value: data.youtubeChannelName,
        inline: true
      },
      {
        name: 'Tempo de música',
        value: secondsToDisplayTime(data.songDuration),
        inline: true
      },
      {
        name: 'Estimado tocar em',
        value: secondsToDisplayTime(data.timeUntilPlaying),
        inline: true
      },
      {
        name: 'Posição na fila',
        value: data.positionInQueue.toString(),
        inline: true
      }
    ]
  }

  return logMessage
}

const makeCardHelp = (commandDescription: string[], currentPage = 0) => {
  const { amountPage, pageSize, offset, page } = calculatePagination(
    commandDescription,
    currentPage,
    10
  )
  const description: string[] = []

  commandDescription.splice(offset, pageSize).forEach((desc) => {
    description.push(desc)
  })

  const logMessage: MessageEmbedOptions = {
    title: 'Comandos do Ricardo Music',
    color: '#e75454',
    description: buildDescription(description),
    footer: {
      text: `Página ${page}/${amountPage}`
    }
  }

  return logMessage
}

const makeCardNowPlaying = (data: CurrentSongData) => {
  const description = [
    `\`${buildProgressBar(data.elapsedTime, data.duration)}\``,
    `\`${secondsToDisplayTime(data.elapsedTime)} / ${secondsToDisplayTime(
      data.duration
    )}\``,
    `\`Música adicionada por: ${data.userRequestName}\``
  ]

  const logMessage: MessageEmbedOptions = {
    title: data.name,
    color: '#26ff00',
    author: {
      name: 'Tocando agora'
    },
    url: data.url,
    thumbnail: {
      url: data.imageUrl
    },
    description: buildDescription(description)
  }

  return logMessage
}

const makeCardSongList = (
  data: SongData[],
  currentPage = 0,
  currentSongId = 0
) => {
  const { amountPage, amountData, pageSize, offset, page } =
    calculatePagination(data, currentPage)
  const currentSong = data[currentSongId]
  const description: string[] = [buildMusicDetail(currentSong)]
  const amountSong = amountData
  const totalTimeOfSong = data.reduce((sum, song) => sum + song.duration, 0)

  data.splice(offset, pageSize).forEach((song, index) => {
    description.push(buildMusicDetail(song, index + offset))
  })

  description.push(
    `${amountSong} músicas na lista :: total ${secondsToDisplayTime(
      totalTimeOfSong
    )}`
  )

  const logMessage: MessageEmbedOptions = {
    title: 'Lista de músicas',
    color: '#d4cc16',
    thumbnail: {
      url: currentSong.imageUrl
    },
    description: buildDescription(description),
    footer: {
      text: `Página ${page}/${amountPage}`
    }
  }

  return logMessage
}

const buildDescription = (descriptions: string[], breakCount = 2) => {
  const breaker = new Array(breakCount).fill('\n').join('')
  return descriptions.join(breaker)
}

const buildMusicDetail = (song: SongData, index?: number) => {
  const buildDescription: string[] = []
  if (index !== undefined) {
    if (index === 0) {
      buildDescription.push('Na lista:\n')
    }
    buildDescription.push(`\`${index + 1}.\``)
  } else {
    buildDescription.push('Tocando agora:\n')
  }
  buildDescription.push(`[${song.name}](${song.url})`)
  buildDescription.push(' :: ')
  buildDescription.push(secondsToDisplayTime(song.duration))
  buildDescription.push('\n')
  buildDescription.push(`\`Adicionado por: ${song.userRequestName}\``)
  return buildDescription.join('')
}

const buildProgressBar = (currentTime: number, endTime: number) => {
  const barChar = '▬'
  const circleChar = '🔘'

  const barSize = 30
  const percent = Math.floor((currentTime * 100) / endTime)
  const circlePosition = Math.floor((percent * barSize) / 100)

  const progressBar = new Array(barSize).fill(barChar)
  progressBar[circlePosition] = circleChar

  return progressBar.join('')
}

const calculatePagination = (data: any[], page: number, pageSize = 10) => {
  const amountData = data.length
  const amountPage = Math.ceil(amountData / pageSize)
  page++
  if (page > amountPage) page = amountPage - 1
  const offset = (page - 1) * pageSize

  return {
    amountPage,
    amountData,
    offset,
    pageSize,
    page
  }
}

export {
  makeCardMusic,
  makeCardNowPlaying,
  makeCardSongList,
  makeCardMessage,
  makeCardHelp
}
