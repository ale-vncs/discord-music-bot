import { EntityRepository, Repository } from 'typeorm'
import { PlaylistMusic } from './playlist-music.entity'

@EntityRepository(PlaylistMusic)
export class PlaylistMusicRepository extends Repository<PlaylistMusic> {}
