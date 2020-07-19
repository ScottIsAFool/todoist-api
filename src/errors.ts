export class TodoistError extends Error {
  __proto__: Error;
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);

    this.__proto__ = trueProto;
  }
}

export class TodoistHttpError extends TodoistError {
  constructor(httpStatus: number, message?: string) {
    super(message);
    this._httpStatus = httpStatus;
  }

  private readonly _httpStatus: number;

  get httpStatus(): number {
    return this._httpStatus;
  }
}
