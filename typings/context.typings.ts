import { Message } from 'discord.js'
import { SongManagerService } from '@modules/song/song-manager.service'

const context = ['api', 'scheduler', 'bot'] as const

export type AppContextType = typeof context[number]

export interface ContextKeys {
  req: {
    method: string
    host: string
    originalUrl: string
  }
  logger: {
    transactionId: string
    context: AppContextType
  }
  discord: {
    message: Message
  }
  song: {
    currentSongManager: SongManagerService
  }
}
