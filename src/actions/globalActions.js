// - Import image gallery action types
import { GlobalActionType } from '../constants/globalActionType'
// - Import actions
import * as serverActions from './serverActions'

import { Feed, SocialError } from '../class/common'
import { ServerRequestModel } from '../class/server'
import { ServerRequestStatusType } from './serverRequestStatusType'

import { CommonService as commonService } from '../services'

/**
 * Add a normal feed
 */
export let dbSendFeed = (newFeed) => {
  return (dispatch, getState) => {

    let uid = getState().authorize.uid

    // Set server request status to {Sent}
    const feedbackRequest = createFeedbackRequest(uid)
    dispatch(serverActions.sendRequest(feedbackRequest))

    return commonService.addFeed(newFeed).then(() => {
      // Set server request status to {OK}
      feedbackRequest.status = ServerRequestStatusType.OK
      dispatch(serverActions.sendRequest(feedbackRequest))
    })
      .catch((error) => {
        dispatch(showMessage(error.message))

        // Set server request status to {Error}
        feedbackRequest.status = ServerRequestStatusType.Error
        dispatch(serverActions.sendRequest(feedbackRequest))
      })
  }
}

// - Show notification of request
export const showNotificationRequest = () => {
  return (dispatch, getState) => {
    const state = getState()
    return dispatch(showMessage('common.sentRequestMessage'))
  }
}

// - Show notification of success
export const showNotificationSuccess = () => {
  return (dispatch, getState) => {
    const state = getState()
    return dispatch(showMessage('common.successfulRequestMessage'))
  }
}

// - Internal request------------------

/**
 * Progress change
 */
export const progressChange = (percent, visible) => {
  return {
    type: GlobalActionType.PROGRESS_CHANGE,
    payload: { percent, visible }
  }

}

/**
 * Default data loaded status will be true
 */
export const defaultDataEnable = () => {
  return {
    type: GlobalActionType.DEFAULT_DATA_ENABLE
  }
}

/**
 * Default data loaded status will be false
 * @param {boolean} status
 */
export const defaultDataDisable = () => {
  return {
    type: GlobalActionType.DEFAULT_DATA_DISABLE
  }
}

/**
 * Hide global message
 */
export const hideMessage = () => {
  hideTopLoading()
  return {
    type: GlobalActionType.HIDE_MESSAGE_GLOBAL
  }

}

/**
 * Show message
 * @param {string} message
 */
export const showMessage = (message) => {
  if (!message || message === '' || (message && message.trim() === '')) {
    message = 'Bad request'
  }
  return {
    type: GlobalActionType.SHOW_MESSAGE_GLOBAL,
    payload: message
  }

}

/**
 * Set header title
 */
export const setHeaderTitleOpt = (callerKey, payload) => {
  return (dispatch, getState) => {
    switch (callerKey) {
      case 'profile':
        const userName = getState().user.info && getState().user.info[payload] ? getState().user.info[payload].fullName : ''
        dispatch(setHeaderTitle(userName))
        break
      default:
        break
    }

  }

}

/**
 * Set header title
 */
export const setHeaderTitle = (text) => {
  return {
    type: GlobalActionType.SET_HEADER_TITLE,
    payload: text
  }

}

/**
 * Open post write
 */
export const openPostWrite = () => {
  return {
    type: GlobalActionType.OPEN_POST_WRITE
  }

}

/**
 * Close post write
 */
export const closePostWrite = () => {
  return {
    type: GlobalActionType.CLOSE_POST_WRITE
  }

}

/**
 * Show top loading
 */
export const showTopLoading = () => {
  return {
    type: GlobalActionType.SHOW_TOP_LOADING
  }

}

/**
 * Hide top loading
 */
export const hideTopLoading = () => {
  return {
    type: GlobalActionType.HIDE_TOP_LOADING
  }

}

/**
 * Show master loading
 */
export const showMasterLoading = () => {
  return {
    type: GlobalActionType.SHOW_MASTER_LOADING
  }

}

/**
 * Show send feedback
 */
export const showSendFeedback = () => {
  return {
    type: GlobalActionType.SHOW_SEND_FEEDBACK
  }

}

/**
 * Hide send feedback
 */
export const hideSendFeedback = () => {
  return {
    type: GlobalActionType.HIDE_SEND_FEEDBACK
  }

}

/**
 * Hide master loading
 */
export const hideMasterLoading = () => {
  return {
    type: GlobalActionType.HIDE_MASTER_LOADING
  }

}

/**
 * Store temp data
 */
export const temp = (data) => {
  return {
    type: GlobalActionType.TEMP,
    payload: data
  }

}

/**
 * Clear temp data
 */
export const clearTemp = () => {
  return {
    type: GlobalActionType.CLEAR_ALL_GLOBAL
  }

}

// - Load data for guest
export const loadDataGuest = () => {
  // tslint:disable-next-line:no-empty
  return (dispatch, getState) => {
  }

}

/**
 * Create send feedback serevr request model
 */
const createFeedbackRequest = (userId) => {
  const requestId = 'CommonSendFeedback' + ':' + userId
  return new ServerRequestModel(
    'CommonSendFeedback',
    requestId,
    '',
    'Sent'
  )
}
