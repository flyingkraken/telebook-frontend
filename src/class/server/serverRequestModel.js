export class ServerRequestModel {
  constructor (
    type,
    id,
    metadata,
    status= 'Sent'
  ) {}

  getKey () {
    return this.type + ':' + this.id
  }
}
