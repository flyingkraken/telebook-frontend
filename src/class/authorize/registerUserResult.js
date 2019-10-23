export class RegisterUserResult {
  constructor (uid) {
    this._uid = uid
  }

  uid () {
    return this._uid
  }
}
