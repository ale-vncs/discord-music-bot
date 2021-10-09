import QueueService from '@app/services/queue.service'
import { Null } from '@typings/generic.type'

abstract class AbstractService {
  private queue: Null<QueueService> = null

  public setQueue(queue: QueueService) {
    this.queue = queue
  }

  public getQueue(): QueueService {
    if (!this.queue) {
      throw new Error('Não possui queue')
    }
    return this.queue
  }
}

export default AbstractService
