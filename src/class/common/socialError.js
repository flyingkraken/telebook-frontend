export class SocialError extends Error {
  constructor (_code, _message) {
    super(_message)
    this._isError = true
  }

  code () {
    return this._code
  }

  message () {
    return this._message
  }

  isError () {
    return this._isError
  }
}
