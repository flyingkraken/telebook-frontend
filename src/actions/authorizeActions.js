
// - Import react components
import { push } from 'react-router-redux'
// -Import domain
import { User } from '../class/users'
import { SocialError } from '../class/common'
import { OAuthType, LoginUser } from '../class/authorize'
// - Import action types
import { AuthorizeActionType } from '../constants/authorizeActionType'

// - Import actions
import * as globalActions from './globalActions'

import { AuthorizeService as authorizeService } from '../services'

/* _____________ CRUD State _____________ */

/**
 * Loing user
 * @param {string} uids
 */
export const login = (uid, isVerifide) => {
  return {
    type: AuthorizeActionType.LOGIN,
    payload: { authed: true, isVerifide, uid }
  }
}

/**
 * Logout user
 */
export const logout = () => {
  return { type: AuthorizeActionType.LOGOUT }
}

/**
 * User registeration call
 * @param user  for registering
 */
export const signup = (user) => {
  return {
    type: AuthorizeActionType.SIGNUP,
    payload: { ...user }
  }

}

/**
 * Update user's password
 */
export const updatePassword = () => {
  return { type: AuthorizeActionType.UPDATE_PASSWORD }
}

/* _____________ CRUD DB _____________ */

/**
 * Log in user in server
 */
export const dbLogin = (email, password) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())
    return authorizeService.login(email, password).then((result) => {
      dispatch(globalActions.showNotificationSuccess())
      dispatch(login(result.uid, result.emailVerified))
      dispatch(push('/'))
    }, (error: SocialError) => dispatch(globalActions.showMessage(error.code)))
  }
}

/**
 * Log out user in server
 */
export const dbLogout = () => {
  return (dispatch, getState) => {
    return authorizeService.logout().then((result) => {
      dispatch(logout())
      dispatch(push('/login'))

    }, (error: SocialError) => dispatch(globalActions.showMessage(error.code)))
  }

}

/**
 * Send email verification
 */
export const dbSendEmailVerfication = () => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())

    return authorizeService.sendEmailVerification().then(() => {
      // Send email verification successful.
      dispatch(globalActions.showNotificationSuccess())
      dispatch(push('/'))
    })
      .catch((error) => {
        // An error happened.
        dispatch(globalActions.showMessage(error.code))

      })
  }
}

/**
 *
 * @param user for registering
 */
export const dbSignup = (user) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())
    let newUser = new User()
    newUser.email = user.email
    newUser.password = user.password
    newUser.fullName = user.fullName

    return authorizeService.registerUser(newUser).then((result) => {
      dispatch(signup({
        userId: result.uid,
        ...user
      }))
      dispatch(dbSendEmailVerfication())
      dispatch(push('/emailVerification'))
    })
      .catch((error) => dispatch(globalActions.showMessage(error.code)))
  }

}

/**
 * Change user's password
 * @param {string} newPassword
 */
export const dbUpdatePassword = (newPassword) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())

    return authorizeService.updatePassword(newPassword).then(() => {

      // Update successful.
      dispatch(globalActions.showNotificationSuccess())
      dispatch(updatePassword())
      dispatch(push('/'))
    })
      .catch((error) => {
        // An error happened.
        switch (error.code) {
          case 'auth/requires-recent-login':
            dispatch(globalActions.showMessage(error.code))
            dispatch(dbLogout())
            break
          default:

        }
      })
  }
}

/**
 * Reset user's password
 * @param {string} newPassword
 */
export const dbResetPassword = (email) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())

    return authorizeService.resetPassword(email).then(() => {

      // Reset password successful.
      dispatch(globalActions.showNotificationSuccess())
      dispatch(push('/login'))
    })
      .catch((error) => {
        // An error happened.
        dispatch(globalActions.showMessage(error.code))

      })
  }
}

/**
 * Login user with OAuth
 */
export const dbLoginWithOAuth = (type) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())

    return authorizeService.loginWithOAuth(type).then((result) => {
      // Send email verification successful.
      dispatch(globalActions.showNotificationSuccess())
      dispatch(login(result.uid, true))
      dispatch(push('/'))
    })
    .catch((error) => {
      // An error happened.
      dispatch(globalActions.showMessage(error.code))
    })
  }
}
