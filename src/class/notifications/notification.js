export class Notification {
  constructor (
    id,
    description,
    url,
    notifierUserId,
    notifyRecieverUserId,
    isSeen
  ) { 
    this.id = id
    this.description = description
    this.url = url
    this.notifierUserId = notifierUserId
    this.notifyRecieverUserId = notifyRecieverUserId
    this.isSeen = isSeen
  }
}
