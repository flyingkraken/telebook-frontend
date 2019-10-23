// - Import react components
import { firebaseRef, firebaseAuth, db } from '../../firestoreClient'

import { SocialError, Feed } from '../../class/common'

/**
 * Firbase common service
 *
 * @export
 * @class CommonService
 * @implements {ICommonService}
 */

export class CommonService {

  /**
   * Post feedback
   */
  addFeed(feed) {
    return new Promise((resolve, reject) => {
      let feedRef = db.collection(`feeds`).doc()
      feedRef.set({ ...feed, id: feedRef.id })
        .then(() => {
          resolve(feedRef.id)
        })
        .catch((error) => {
          reject(new SocialError(error.code, error.message))
        })
    })
  }
}
