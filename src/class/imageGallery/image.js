export class Image {
  constructor (
    id,
    creationDate,
    deleteDate,
    URL,
    fullPath,
    ownerUserId,
    lastEditDate,
    deleted
  ) { 
    this.id = id
    this.creationDate = creationDate
    this.deleteDate = deleteDate
    this.URL = URL
    this.fullPath = fullPath
    this.ownerUserId = ownerUserId
    this.lastEditDate = lastEditDate
    this.deleted = deleted
  }
}
