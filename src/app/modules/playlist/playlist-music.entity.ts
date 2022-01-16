import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  JoinColumn
} from 'typeorm'
import { Playlist } from './playlist.entity'

@Entity('playlist_music')
export class PlaylistMusic {
  @PrimaryGeneratedColumn('uuid', { name: 'music_id' })
  musicId!: string

  @ManyToOne(() => Playlist, (playlist) => playlist.musics)
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist

  @Column()
  url: string

  @Unique(['order', 'playlist'])
  @Column()
  order: number

  @Column({ name: 'added_by' })
  addedBy: string
}
