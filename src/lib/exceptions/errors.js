export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

export class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
