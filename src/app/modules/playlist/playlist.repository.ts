import { EntityRepository, Repository } from 'typeorm'
import { Playlist } from './playlist.entity'

@EntityRepository(Playlist)
export class PlaylistRepository extends Repository<Playlist> {}
