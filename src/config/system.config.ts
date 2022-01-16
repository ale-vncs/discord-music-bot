import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import path from 'path'

export const systemConfig = () => {
  const env = process.env

  return {
    appName: env.npm_package_name,
    port: parseInt(env.PORT || '3031'),
    database: <TypeOrmModuleOptions>{
      type: 'mysql',
      host: env.MYSQL_HOST,
      port: parseInt(env.MYSQL_PORT || '3306'),
      username: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: env.MYSQL_DATABASE,
      entities: [path.join(__dirname, '**', '*.entity.ts')],
      synchronize: false,
      autoLoadEntities: true
    },
    discord: {
      prefix: env.BOT_DEFAULT_PREFIX,
      token: env.DISCORD_TOKEN,
      ignoreBotMessage: env.IGNORE_BOT_MESSAGE === 'true'
    }
  }
}

export type SystemConfig = ReturnType<typeof systemConfig>
