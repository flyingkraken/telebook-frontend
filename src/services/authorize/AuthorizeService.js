import { Profile } from '../../class/users'

// - Import react components
import { firebaseRef, firebaseAuth, db } from '../../firestoreClient'

import { User, UserProvider } from '../../class/users'
import { LoginUser, RegisterUserResult } from '../../class/authorize'
import { SocialError } from '../../class/common'

import { OAuthType } from '../../class/authorize/oauthType'
import moment from 'moment/moment'
/**
 * Firbase authorize service
 *
 * @export
 * @class AuthorizeService
 * @implements {IAuthorizeService}
 */
export class AuthorizeService {

    /**
     * Login the user
     *
     * @returns {Promise<LoginUser>}
     * @memberof IAuthorizeService
     */
  login(email, password) {
    return new Promise((resolve, reject) => {
      firebaseAuth()
                .signInWithEmailAndPassword(email, password)
                .then((result) => {
                  resolve(new LoginUser(result.uid, result.emailVerified))
                })
                .catch((error) => {
                  reject(new SocialError(error.code, error.message))
                })
    })
  }

    /**
     * Logs out the user
     *
     * @returns {Promise<void>}
     * @memberof IAuthorizeService
     */
  logout() {
    return new Promise((resolve, reject) => {
      firebaseAuth()
                .signOut()
                .then((result) => {
                  resolve()
                })
                .catch((error) => {

                  reject(new SocialError(error.code, error.message))
                })
    })
  }

   /**
    * Register a user
    *
    * @returns {Promise<void>}
    * @memberof IAuthorizeService
    */
  registerUser(user) {
    return new Promise((resolve, reject) => {
      firebaseAuth()
                .createUserWithEmailAndPassword(user.email, user.password)
                .then((signupResult) => {
                  const {uid, email} = signupResult
                  this.storeUserInformation(uid,email,user.fullName,'').then(resolve)
                })
                .catch((error) => reject(new SocialError(error.code, error.message)))
    })
  }

   /**
    * Update user password
    *
    * @returns {Promise<void>}
    * @memberof IAuthorizeService
    */
  updatePassword(newPassword) {
    return new Promise((resolve, reject) => {
      let user = firebaseAuth().currentUser
      if (user) {
        user.updatePassword(newPassword).then(() => {
                    // Update successful.
          resolve()
        }).catch((error) => {
                    // An error happened.
          reject(new SocialError(error.code, error.message))
        })
      }
    })
  }

  /**
   * On user authorization changed event
   *
   * @memberof IAuthorizeService
   */
  onAuthStateChanged(callBack) {
    firebaseAuth().onAuthStateChanged( (user) => {
      let isVerifide = false
      if (user) {
        if (user.emailVerified || user.providerData[0].providerId.trim() !== 'password') {
          isVerifide = true
        } else {
          isVerifide = false
        }
      }
      callBack(isVerifide,user)
    })
  }

  /**
   * Reset user password
   *
   * @memberof AuthorizeService
   */
  resetPassword(email) {
    return new Promise((resolve,reject) => {
      let auth = firebaseAuth()

      auth.sendPasswordResetEmail(email).then(function () {
        resolve()
      }).catch((error) => {
        // An error happened.
        reject(new SocialError(error.code, error.message))
      })
    })
  }

  /**
   * Send verfication email to user email
   *
   * @memberof AuthorizeService
   */
  sendEmailVerification() {
    return new Promise((resolve,reject) => {
      let auth = firebaseAuth()
      const user = auth.currentUser

      if (user) {
        user.sendEmailVerification().then(() => {
          resolve()
        }).catch((error) => {
          // An error happened.
          reject(new SocialError(error.code, error.message))
        })
      } else {
        reject(new SocialError('authorizeService/nullException', 'User was null!'))
      }

    })
  }

  loginWithOAuth(type) {
    return new Promise((resolve,reject) => {

      let provider

      switch (type) {
        case OAuthType.GITHUB:
          provider = new firebaseAuth.GithubAuthProvider()
          break
        case OAuthType.FACEBOOK:
          provider = new firebaseAuth.FacebookAuthProvider()
          break
        case OAuthType.GOOGLE:
          provider = new firebaseAuth.GoogleAuthProvider()
          break
        default:
          throw new SocialError('authorizeService/loginWithOAuth','None of OAuth type is matched!')
      }
      firebaseAuth().signInWithPopup(provider).then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        let token = result.credential.accessToken
        // The signed-in user info.
        const {user} = result
        const {credential} = result
        const {uid, displayName, email, photoURL} = user
        const {accessToken, providerId} = credential
        this.storeUserProviderData(uid,email,displayName,photoURL,providerId,accessToken)
        // this.storeUserInformation(uid,email,displayName,photoURL).then(resolve)
        resolve(new LoginUser(user.uid,true,providerId,displayName,email,photoURL))

      }).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code
        let errorMessage = error.message
        // The email of the user's account used.
        let email = error.email
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential

      })

    })
  }

  /**
   * Store user information
   *
   * @private
   * @memberof AuthorizeService
   */
  storeUserInformation(userId, email, fullName, avatar) {
    return new Promise((resolve,reject) => {
      db.doc(`userInfo/${userId}`).set(
        {
          id: userId,
          state: 'active',
          avatar,
          fullName,
          creationDate: moment().unix(),
          email
        }
      )
      .then(() => {
        resolve(new RegisterUserResult(userId))
      })
      .catch((error) => reject(new SocialError(error.name, 'firestore/storeUserInformation : ' + error.message)))
    })
  }

  /**
   * Store user provider information
   *
   * @private
   * @memberof AuthorizeService
   */
  storeUserProviderData(
    userId,
    email,
    fullName,
    avatar,
    providerId,
    accessToken
  ) {
    return new Promise((resolve,reject) => {
      db.doc(`userProviderInfo/${userId}`)
      .set(
        {
          userId,
          email,
          fullName,
          avatar,
          providerId,
          accessToken
        }
      )
      .then(() => {
        resolve(new RegisterUserResult(userId))
      })
      .catch((error) => reject(new SocialError(error.name, error.message)))
    })
  }
}
