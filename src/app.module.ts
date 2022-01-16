import { MiddlewareConsumer, Module, Scope } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '@logger/logger.module'
import { APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { systemConfig } from '@config/system.config'
import { ContextModule } from '@context/context.module'
import helmet from 'helmet'
import { ConfigMiddleware } from '@middlewares/config.middleware'
import { ScheduleModule } from '@nestjs/schedule'
import { AllExceptionsFilter } from '@filters/all-exceptions.filter'
import { InitializerModule } from '@modules/initializer/initializer.module'
import { CommandModule } from '@modules/command/command.module'
import { DiscordModule } from '@modules/discord/discord.module'

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
      scope: Scope.DEFAULT
    },
    AppService
  ],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [systemConfig]
    }),
    ContextModule,
    DiscordModule,
    LoggerModule,
    InitializerModule,
    CommandModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet(), ConfigMiddleware).forRoutes('*')
  }
}
