// - Import react components
import firebase, { firebaseRef, firebaseAuth, db } from '../../fireStoreClient'
import moment from 'moment/moment'

import { SocialError } from '../../class/common'
import { Profile, UserProvider, User } from '../../class/users'
import { Graph } from '../../class/graphs'
import { UserTie } from '../../class/circles'

export class UserTieService {
  tieUseres(userTieSenderInfo, userTieReceiveInfo, circleIds) {
    return new Promise((resolve, reject) => {
      this._graphService
      .addGraph(
        new Graph(
          userTieSenderInfo.userId,
          'TIE',
          userTieReceiveInfo.userId,
          {...userTieSenderInfo},
          {...userTieReceiveInfo},
          {creationDate: Date.now(), circleIds}
        )
      ,'users'
    ).then((result) => {
      resolve()
    })
    .catch((error) => reject(new SocialError(error.code, 'firestore/tieUseres :' + error.message)))
    })
  }

  updateUsersTie(userTieSenderInfo, userTieReceiveInfo, circleIds) {
    return new Promise((resolve, reject) => {
      this._graphService
      .updateGraph(
        new Graph(
          userTieSenderInfo.userId,
          'TIE',
          userTieReceiveInfo.userId,
          {...userTieSenderInfo},
          {...userTieReceiveInfo},
          {creationDate: Date.now(), circleIds}
        )
      ,'users'
    ).then(() => {
      resolve()
    })
    .catch((error) => reject(new SocialError(error.code, 'firestore/updateUsersTie :' + error.message)))
    })
  }

  removeUsersTie(firstUserId, secondUserId) {
    return new Promise((resolve, reject) => {
      this.getUserTiesWithSeconUser(firstUserId,secondUserId).then((userTies) => {
        if (userTies.length > 0) {
          this._graphService.deleteGraphByNodeId(userTies[0].nodeId).then(resolve)
        }
      })
      .catch((error) => reject(new SocialError(error.code, 'firestore/removeUsersTie :' + error.message)))
    })
  }

  getUserTies(userId) {
    return new Promise((resolve, reject) => {
      this._graphService
      .getGraphs(
        'users',
        userId,
        'TIE')
      .then((result) => {

        let parsedData = {}
        result.forEach((node) => {
          const leftUserInfo = node.LeftMetadata
          const rightUserInfo = node.rightMetadata
          const metadata: {creationDate: number, circleIds: string[]} = node.graphMetadata
          parsedData = {
            ...parsedData,
            [rightUserInfo.userId] : {
              ...rightUserInfo,
              circleIdList: metadata ? metadata.circleIds : []
            }
          }
        })
        resolve(parsedData)
      })
        .catch((error) => reject(new SocialError(error.code, 'firestore/getUserTies :' + error.message)))
    })
  }

  /**
   * Get the users who tied current user
   */
  getUserTieSender(userId) {
    return new Promise((resolve, reject) => {
      this._graphService
      .getGraphs(
        'users',
        null,
        'TIE',
        userId
      )
      .then((result) => {
        let parsedData = {}

        result.forEach((node) => {
          const leftUserInfo: UserTie = node.LeftMetadata
          const rightUserInfo: UserTie = node.rightMetadata
          const metada: {creationDate: number, circleIds: string[]} = node.graphMetadata
          parsedData = {
            ...parsedData,
            [leftUserInfo.userId] : {
              ...leftUserInfo,
              circleIdList: []
            }
          }
        })
        resolve(parsedData)
      })
        .catch((error) => reject(new SocialError(error.code, 'firestore/getUserTieSender :' + error.message)))
    })
  }

  getUserTiesWithSeconUser(userId, secondUserId) {
    return new Promise((resolve, reject) => {
      this._graphService
      .getGraphs(
        'users',
        userId,
        'TIE',
        secondUserId
      ).then(resolve)
      .catch(reject)
    })
  }
}
