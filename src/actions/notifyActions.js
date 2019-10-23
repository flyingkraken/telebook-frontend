import { Notification } from '../class/notifications'
import { SocialError } from '../class/common'

// - Import action types
import { NotificationActionType } from '../constants/notificationActionType'

// - Import actions
import * as globalActions from './globalActions'
import * as userActions from './userActions'

import { NotificationService as notificationService } from '../services'
/* _____________ CRUD DB _____________ */

/**
 *  Add notificaition to database
 * @param  {object} newNotify user notificaition
 */
export const dbAddNotification = (newNotify) => {
  return (dispatch, getState) => {

    let notify = {
      isSeen: false,
      description: newNotify.description,
      url: newNotify.url,
      notifierUserId: newNotify.notifierUserId,
      notifyRecieverUserId: newNotify.notifyRecieverUserId
    }

    return notificationService.addNotification(notify)
      .then(() => {
        dispatch(addNotify())
      })
      .catch((error) => dispatch(globalActions.showMessage(error.message)))

  }
}

/**
 * Get all notificaitions from database
 */
export const dbGetNotifications = () => {
  return (dispatch , getState) => {
    let uid = getState().authorize.uid
    if (uid) {
      return notificationService.getNotifications(uid,
        (notifications) => {
          Object.keys(notifications).forEach((key => {
            if (!getState().user.info[notifications[key].notifierUserId]) {
              dispatch(userActions.dbGetUserInfoByUserId(notifications[key].notifierUserId,''))
            }
          }))
          dispatch(addNotifyList(notifications))
        })
    }
  }
}

/**
 * Delete a notificaition from database
 * @param  {string} id of notificaition
 */
export const dbDeleteNotification = (id) => {
  return (dispatch, getState) => {

    // Get current user id
    let uid: string = getState().authorize.uid

    return notificationService.deleteNotification(id,uid).then(() => {
      dispatch(deleteNotify(id))
    })
    .catch((error: SocialError) => dispatch(globalActions.showMessage(error.message)))
  }

}

/**
 * Make seen a notificaition from database
 * @param  {string} id of notificaition
 */
export const dbSeenNotification = (id) => {
  return (dispatch, getState) => {

    // Get current user id
    let uid: string = getState().authorize.uid
    let notify: Notification = getState().notify.userNotifies[id]

    let updatedNotification: Notification = {
      description: notify.description,
      url: notify.url,
      notifierUserId: notify.notifierUserId,
      notifyRecieverUserId: uid,
      isSeen: true
    }

    return notificationService.setSeenNotification(id,uid,updatedNotification)
    .then(() => {
      dispatch(seenNotify(id))
    })
    .catch((error) => dispatch(globalActions.showMessage(error.message)))
  }

}

/* _____________ CRUD State _____________ */

/**
 * Add notificaition
 */
export const addNotify = () => {

  return {
    type: NotificationActionType.ADD_NOTIFY
  }
}

/**
 * Add notificaition list
 * @param {[notifyId: string]: Notification} userNotifies an array of notificaitions
 */
export const addNotifyList = (userNotifies) => {

  return {
    type: NotificationActionType.ADD_NOTIFY_LIST,
    payload: userNotifies
  }
}

/**
 * Delete a notificaition
 * @param  {string} id of notificaition
 */
export const deleteNotify = (id) => {
  return { type: NotificationActionType.DELETE_NOTIFY, payload: id }

}

/**
 * Change notificaition to has seen status
 * @param  {string} id of notificaition
 */
export const seenNotify = (id) => {
  return { type: NotificationActionType.SEEN_NOTIFY, payload: id }

}

/**
 * Clear all data
 */
export const clearAllNotifications = () => {
  return {
    type: NotificationActionType.CLEAR_ALL_DATA_NOTIFY
  }
}
