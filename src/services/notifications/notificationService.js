import { firebaseRef, firebaseAuth, db } from '../../firestoreClient'

import { SocialError } from '../../class/common'

/**
 * Firbase notification service
 *
 * @export
 * @class NotificationService
 * @implements {INotificationService}
 */
export class NotificationService {
  addNotification(notification) {
    return new Promise((resolve,reject) => {
      db.doc(`users/${notification.notifyRecieverUserId}`).collection(`notifications`)
      .add({...notification})
      .then(() => {
        resolve()
      })
    })
  }

  getNotifications(userId,callback) {
    let notificationsRef = db.doc(`users/${userId}`).collection('notifications')
    notificationsRef.onSnapshot((snapshot) => {
      let parsedData = {}
      snapshot.forEach((result) => {
        parsedData[result.id] = {
          id: result.id,
          ...result.data()
        }
      })
      callback(parsedData)
    })
  }

  deleteNotification(notificationId, userId) {
    return new Promise((resolve, reject) => {
      const batch = db.batch()
      const notificationRef = db.doc(`users/${userId}/notifications/${notificationId}`)

      batch.delete(notificationRef)
      batch.commit().then(() => {
        resolve()
      })
      .catch((error) => {
        reject(new SocialError(error.code, error.message))
      })
    })
  }

  setSeenNotification(notificationId, userId, notification) {
    return new Promise((resolve, reject) => {
      const batch = db.batch()
      const notificationRef = db.doc(`users/${userId}/notifications/${notificationId}`)

      batch.update(notificationRef,{...notification})
      batch.commit().then(() => {
        resolve()
      })
      .catch((error) => {
        reject(new SocialError(error.code, error.message))
      })
    })
  }
}
