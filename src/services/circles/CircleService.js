// - Import react components
import { firebaseRef, firebaseAuth, db } from '../../fireStoreClient'

import { SocialError } from '../../class/common'
import { Circle, UserTie } from '../../class/circles'
import { User } from '../../class/users'

/**
 * Firbase circle service
 *
 * @export
 * @class CircleService
 * @implements {ICircleService}
 */

export class CircleService {
  addCircle(userId, circle) {
    return new Promise((resolve,reject) => {
      let circleRef = db.doc(`users/${userId}`).collection(`circles`).add({...circle})
      circleRef.then((result) => {
        resolve(result.id)
      })
    })
  }

  updateCircle(userId, circleId, circle) {
    return new Promise((resolve,reject) => {

      const batch = db.batch()
      const circleRef = db.doc(`users/${userId}/circles/${circleId}`)

      batch.update(circleRef,{...circle})
      batch.commit().then(() => {
        resolve()
      })
      .catch((error) => {
        reject(new SocialError(error.code, error.message))
      })

    })
  }

  deleteCircle(userId, circleId) {
    return new Promise((resolve,reject) => {

      const batch = db.batch()
      const circleRef = db.doc(`users/${userId}/circles/${circleId}`)

      batch.delete(circleRef)
      batch.commit().then(() => {
        resolve()
      })
      .catch((error) => {
        reject(new SocialError(error.code, error.message))
      })

    })
  }

  getCircles(userId) {
    return new Promise((resolve,reject) => {
      let circlesRef = db.doc(`users/${userId}`).collection(`circles`)

      circlesRef.onSnapshot((snapshot) => {
        let parsedData = {}
        snapshot.forEach((result) => {
          parsedData[result.id] = {
            id: result.id,
            ...result.data()
          }
        })
        resolve(parsedData)
      })
    })
  }
}
