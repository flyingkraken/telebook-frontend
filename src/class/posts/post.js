export class Post {
  constructor (
    id,
    postTypeId,
    creationDate,
    deleteDate,
    score,
    body,
    ownerUserId,
    ownerDisplayName,
    ownerAvatar,
    lastEditDate,
    image,
    imageFullPath,
    deleted
  ) { 
    this.id = id
    this.postTypeId = postTypeId
    this.creationDate = creationDate
    this.deleteDate = deleteDate
    this.score = score
    this.body = body
    this.ownerUserId = ownerUserId
    this.ownerDisplayName = ownerDisplayName
    this.ownerAvatar = ownerAvatar
    this.lastEditDate = lastEditDate
    this.image = image
    this.imageFullPath = imageFullPath
    this.deleted = deleted
  }
}
