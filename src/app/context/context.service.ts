import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SystemConfig } from '@config/system.config'
import { ContextUtil } from '@utils/context.util'
import { Undefined } from '@typings/generic.typing'
import { AppContextType, ContextKeys } from '@typings/context.typings'

@Injectable()
export class ContextService {
  private contextUtil = ContextUtil.getInstance()

  constructor(private configService: ConfigService) {}

  getConfig<T extends keyof SystemConfig>(key: T) {
    return this.configService.get<SystemConfig[T]>(key)
  }

  getDataContext<K extends keyof ContextKeys>(
    key: K
  ): Undefined<ContextKeys[K]> {
    return this.contextUtil.getContext(key)
  }

  setDataContext<K extends keyof ContextKeys>(key: K, data: ContextKeys[K]) {
    this.contextUtil.setContext(key, data)
  }

  changeContext(context: AppContextType, cb: () => void) {
    this.contextUtil.changeContext(context, cb)
  }
}
