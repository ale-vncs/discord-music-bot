import { createNamespace, Namespace } from 'cls-hooked'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import { Undefined } from '@typings/generic.typing'
import { AppContextType, ContextKeys } from '@typings/context.typings'

export class ContextUtil {
  private static instance: ContextUtil
  private readonly ns: Namespace

  private constructor() {
    this.ns = createNamespace(uuidV4())
    ContextUtil.instance = this
  }

  static getInstance() {
    return ContextUtil.instance ?? new ContextUtil()
  }

  changeContext(namespace: AppContextType, cb: () => void) {
    this.ns.run(() => {
      this.setContext('logger', {
        context: namespace,
        transactionId: uuidV4()
      })
      cb()
    })
  }

  setContext<K extends keyof ContextKeys>(key: K, data: ContextKeys[K]) {
    if (this.existContext()) this.ns.set(key, data)
  }

  getContext<K extends keyof ContextKeys>(key: K): Undefined<ContextKeys[K]> {
    if (this.existContext()) return this.ns.get(key)
  }

  private existContext() {
    return this.ns && this.ns.active
  }

  static middleware(req: Request, res: Response, next: NextFunction) {
    const context = ContextUtil.getInstance()
    context.changeContext('api', () => next())
  }
}
