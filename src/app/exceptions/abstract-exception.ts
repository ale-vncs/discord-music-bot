export abstract class AbstractException extends Error {
  protected constructor(message: string) {
    super(message)
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, new.target)
  }
}
