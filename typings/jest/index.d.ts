
declare module 'jest' {
  export interface Matchers<R> {
    toBeTypeOrNull(type: unknown): R;
  }
}
