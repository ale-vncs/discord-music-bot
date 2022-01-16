import { Global, Module } from '@nestjs/common'
import { WinstonLoggerService } from '@logger/winston-logger.service'
import { LoggerAbstract } from '@logger/logger.abstract'

@Global()
@Module({
  providers: [
    {
      provide: LoggerAbstract,
      useClass: WinstonLoggerService
    }
  ],
  exports: [LoggerAbstract]
})
export class LoggerModule {}
