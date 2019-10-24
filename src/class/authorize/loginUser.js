export class LoginUser {
  constructor (
   _uid,
   _emailVerified,
   _providerId = '',
   _displayName = '',
   _email = '',
   _avatarURL = ''
  ) {
    this._uid = _uid
    this._emailVerified = _emailVerified
    this._providerId = _providerId
    this._displayName = _displayName
    this._email = _email
    this._avatarURL = _avatarURL
  }


  uid() {
    return this._uid
  }

  emailVerified() {
    return this._emailVerified
  }

  providerId() {
    return this._providerId
  }

  displayName() {
    return this._displayName
  }

  email() {
    return this._email
  }

  avatarURL() {
    return this._avatarURL
  }
}
