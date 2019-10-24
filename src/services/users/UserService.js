// - Import react components
import firebase, { firebaseRef, firebaseAuth, db } from '../../fireStoreClient'
import moment from 'moment/moment'

import { SocialError } from '../../class/common'
import { Profile, UserProvider } from '../../class/users'

export class UserService {
  getUserProfile(userId) {
    return new Promise((resolve, reject) => {
      let userProfileRef = db.doc(`userInfo/${userId}`)
      userProfileRef.get().then((result) => {
        if (!result.exists) {
          this.getUserProviderData(userId).then((providerData) => {
            if (!UserProvider || !providerData.email) {
              reject(reject(new SocialError(`firestore/providerdata`, 'firestore/getUserProfile : Provider data or email of provider data is empty!')))
            }
            const {avatar,fullName, email} = providerData
            const userProfile = new Profile(avatar,fullName && fullName !== '' ? fullName : email ,'','',moment().unix(),email, -1, '', '', '')
            resolve(userProfile)
            this.updateUserProfile(userId,userProfile)
          })
        } else {
          resolve(result.data())
        }

      })
        .catch((error) => reject(new SocialError(error.code, 'firestore/getUserProfile :' + error.message)))
    })
  }

  updateUserProfile(userId, profile) {
      return new Promise((resolve, reject) => {
        const batch = db.batch()
        const profileRef = db.doc(`userInfo/${userId}`)

        batch.set(profileRef,{...profile, id: userId, state: 'active'})
        batch.commit().then(() => {
          resolve()
        })
          .catch((error) => reject(new SocialError(error.code, 'firestore/updateUserProfile' + error.message)))
      })
    }

  getUsersProfile(userId, lastUserId, page, limit = 10) {
      return new Promise((resolve, reject) => {
        let parsedData = []

        let query = db.collection('userInfo').where('state', '==', 'active')
        if (lastUserId && lastUserId !== '') {
          query = query.orderBy('id').orderBy('creationDate', 'desc').startAfter(lastUserId)
        }
        if (limit) {
          query = query.limit(limit)
        }

        query.get().then((users) => {
          let newLastUserId = users.size > 0 ? users.docs[users.docs.length - 1].id : ''
          users.forEach((result) => {
            const user = result.data()
            parsedData = [
              ...parsedData,
              {
                [result.id]: {
                  ...user
                }
              }

            ]
          })
          resolve({ users: parsedData, newLastUserId })
        })
          .catch((error) => {
            reject(new SocialError(error.code, error.message))
          })
      })
    }

  getUserProviderData(userId) {
    return new Promise((resolve,reject) => {
      let userProviderRef = db.doc(`userProviderInfo/${userId}`)
      userProviderRef.get().then((snapshot) => {
        if (snapshot.exists) {
          let userProvider = snapshot.data() || {}
          resolve(userProvider)
        } else {
          throw new SocialError(`firestore/getUserProviderData/notExist `, `document of userProviderRef is not exist `)
        }
      })
      .catch((error) => {
        reject(new SocialError(error.code, 'firestore/getUserProviderData ' + error.message))
      })
    })
  }
}
