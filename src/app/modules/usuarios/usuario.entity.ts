import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'users' })
export class Usuario {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  usuarioId: number

  @Column()
  login: string

  @Column()
  firstname: string

  @Column()
  lastname: string

  @Column({
    name: 'admin',
    transformer: {
      from: (value: number) => value === 1,
      to: (v) => v
    }
  })
  isAdmin: boolean

  @Column({
    name: 'status',
    transformer: {
      from: (v: number) => v === 1,
      to: (v) => v
    }
  })
  isEnabled: boolean

  @Column({
    name: 'last_login_on'
  })
  lastLoginOn: Date

  @Column()
  type: string

  @CreateDateColumn({ name: 'created_on' })
  createdOn: Date

  @UpdateDateColumn({ name: 'updated_on' })
  updatedOn: Date
}
