export class WSFatalError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export class WSError extends Error {
  constructor(message) {
    super(message);
  }
}