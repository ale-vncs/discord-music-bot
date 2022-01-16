import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { PlaylistMusic } from './playlist-music.entity'

@Entity({ name: 'playlist' })
export class Playlist {
  @PrimaryGeneratedColumn('uuid', { name: 'playlist_id' })
  playlistId: string

  @Column({ name: 'guild_id', unique: true })
  guildId: string

  @Column({ unique: true })
  name: string

  @OneToMany(() => PlaylistMusic, (playlistMusic) => playlistMusic.playlist)
  musics: PlaylistMusic[]

  @Column({ name: 'created_by' })
  createdBy: string
}
