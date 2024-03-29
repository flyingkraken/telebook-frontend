import { Post } from '../class/posts'
import { SocialError } from '../class/common'

// - Import utility components
import moment from 'moment/moment'

// - Import action types
import { PostActionType } from '../constants/postActionType'

// - Import actions
import * as globalActions from './globalActions'
import { PostService as postService } from '../services'


/* _____________ CRUD DB _____________ */

/**
 * Add a normal post
 */
export let dbAddPost = (newPost, callBack) => {
  return (dispatch, getState) => {

    let uid: string = getState().authorize.uid
    let post = {
      postTypeId: 0,
      creationDate: moment().unix(),
      deleteDate: 0,
      score: 0,
      viewCount: 0,
      body: newPost.body,
      ownerUserId: uid,
      ownerDisplayName: newPost.ownerDisplayName,
      ownerAvatar: newPost.ownerAvatar,
      lastEditDate: 0,
      commentCounter: 0,
      comments: {},
      image: '',
      imageFullPath: '',
      deleted: false
    }

    return postService.addPost(post).then((postKey) => {
      dispatch(addPost(uid, {
        ...post,
        id: postKey
      }))
      callBack()
    })
      .catch((error) => dispatch(globalActions.showMessage(error.message)))
  }
}

/**
 * Add a post with image
 */
export const dbAddImagePost = (newPost, callBack) => {
  return (dispatch, getState) => {

    dispatch(globalActions.showTopLoading())

    let uid: string = getState().authorize.uid
    let post: Post = {
      postTypeId: 1,
      creationDate: moment().unix(),
      deleteDate: 0,
      score: 0,
      viewCount: 0,
      body: newPost.body,
      ownerUserId: uid,
      ownerDisplayName: newPost.ownerDisplayName,
      ownerAvatar: newPost.ownerAvatar,
      lastEditDate: 0,
      tags: newPost.tags || [],
      commentCounter: 0,
      image: newPost.image || '',
      imageFullPath: newPost.imageFullPath || '',
      video: '',
      disableComments: newPost.disableComments ? newPost.disableComments : false,
      disableSharing: newPost.disableSharing ? newPost.disableSharing : false,
      deleted: false
    }

    return postService.addPost(post).then((postKey) => {
      dispatch(addPost(uid, {
        ...post,
        id: postKey
      }))
      callBack()
      dispatch(globalActions.hideTopLoading())

    })
      .catch((error) => dispatch(globalActions.showMessage(error.message)))

  }

}

/**
 * Update a post from database
 */
export const dbUpdatePost = (updatedPost, callBack) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showTopLoading())

    return postService.updatePost(updatedPost).then(() => {

      dispatch(updatePost(updatedPost))
      callBack()
      dispatch(globalActions.hideTopLoading())

    })
      .catch((error: SocialError) => {
        dispatch(globalActions.showMessage(error.message))
        dispatch(globalActions.hideTopLoading())

      })
  }

}

/**
 * Delete a post from database
 * @param  {string} id is post identifier
 */
export const dbDeletePost = (id) => {
  return (dispatch, getState) => {

    dispatch(globalActions.showTopLoading())

    // Get current user id
    let uid: string = getState().authorize.uid

    return postService.deletePost(id).then(() => {
      dispatch(deletePost(uid, id))
      dispatch(globalActions.hideTopLoading())

    })
      .catch((error) => {
        dispatch(globalActions.showMessage(error.message))
        dispatch(globalActions.hideTopLoading())
      })
  }

}

/**
 * Get all user posts from data base
 */
export const dbGetPosts = (page = 0, limit = 10) => {
  return (dispatch, getState) => {
    const state = getState()
    const {stream} = state.post
    const lastPageRequest = stream.lastPageRequest
    const lastPostId = stream.lastPostId

    let uid: string = state.authorize.uid
    if (uid && lastPageRequest !== page) {
      return postService.getPosts(uid, lastPostId, page, limit).then((result) => {
        if (!result.posts || !(result.posts.length > 0)) {
          return dispatch(notMoreDataStream())
        }

        // Store last post Id
        dispatch(lastPostStream(result.newLastPostId))

        let parsedData: { [userId: string]: {[postId: string]: Post} } = {}
        result.posts.forEach((post) => {
          const postId = Object.keys(post)[0]
          const postData = post[postId]
          const ownerId = postData.ownerUserId
          parsedData = {
            ...parsedData,
            [ownerId]: {
              ...parsedData[ownerId],
              [postId]: {
                ...postData
              }
            }
          }
        })
        dispatch(addPosts(parsedData))
      })
        .catch((error) => {
          dispatch(globalActions.showMessage(error.message))
        })

    }
  }
}

/**
 * Get all user posts from data base
 */
export const dbGetPostsByUserId = (userId, page = 0, limit = 10) => {
  return (dispatch, getState) => {
    const state = getState()
    const {profile} = state.post
    const lastPageRequest = profile[userId] ? profile[userId].lastPageRequest : -1
    const lastPostId = profile[userId] ? profile[userId].lastPostId : ''

    let uid: string = state.authorize.uid

    if (uid && lastPageRequest !== page) {

      return postService.getPostsByUserId(userId, lastPostId, page, limit).then((result) => {

        if (!result.posts || !(result.posts.length > 0)) {
          return dispatch(notMoreDataProfile(userId))
        }
        // Store last post Id
        dispatch(lastPostProfile(userId, result.newLastPostId))

        let parsedData: { [userId: string]: {[postId: string]: Post} } = {}
        result.posts.forEach((post) => {
          const postId = Object.keys(post)[0]
          const postData = post[postId]
          const ownerId = postData.ownerUserId
          parsedData = {
            ...parsedData,
            [ownerId]: {
              ...parsedData[ownerId],
              [postId]: {
                ...postData
              }
            }
          }
        })
        dispatch(addPosts(parsedData))
      })
        .catch((error) => {
          dispatch(globalActions.showMessage(error.message))
        })

    }
  }
}

/**
 * Get all user posts from data base
 */
export const dbGetPostById = (uid, postId) => {
  return (dispatch, getState) => {
    if (uid) {

      return postService.getPostById(postId).then((post: Post) => {
        dispatch(addPost(uid, post))
      })
        .catch((error: SocialError) => {
          dispatch(globalActions.showMessage(error.message))
        })

    }
  }
}

/* _____________ CRUD State _____________ */

/**
 * Add a normal post
 */
export const addPost = (uid, post) => {
  return {
    type: PostActionType.ADD_POST,
    payload: { uid, post }
  }
}

/**
 * Update a post
 */
export const updatePost = (post) => {
  return {
    type: PostActionType.UPDATE_POST,
    payload: { post }
  }
}

/**
 * Delete a post
 */
export const deletePost = (uid, id) => {
  return {
    type: PostActionType.DELETE_POST,
    payload: { uid, id }
  }
}

/**
 * Add a list of post
 */
export const addPosts = (userPosts) => {
  return {
    type: PostActionType.ADD_LIST_POST,
    payload: { userPosts }
  }
}

/**
 * Clea all data in post store
 */
export const clearAllData = () => {
  return {
    type: PostActionType.CLEAR_ALL_DATA_POST
  }
}

/**
 * Add a post with image
 */
export const addImagePost = (uid, post) => {
  return {
    type: PostActionType.ADD_IMAGE_POST,
    payload: { uid, post }
  }

}

/**
 * Set stream has more data to show
 */
export const hasMoreDataStream = () => {
  return {
    type: PostActionType.HAS_MORE_DATA_STREAM
  }

}

/**
 * Set stream has not data any more to show
 */
export const notMoreDataStream = () => {
  return {
    type: PostActionType.NOT_MORE_DATA_STREAM
  }

}

/**
 * Set last page request of stream
 */
export const requestPageStream = (page) => {
  return {
    type: PostActionType.REQUEST_PAGE_STREAM,
    payload: { page}
  }

}

/**
 * Set last post identification of stream
 */
export const lastPostStream = (lastPostId) => {
  return {
    type: PostActionType.LAST_POST_STREAM,
    payload: { lastPostId}
  }

}

/**
 * Set profile posts has more data to show
 */
export const hasMoreDataProfile = () => {
  return {
    type: PostActionType.HAS_MORE_DATA_PROFILE
  }

}

/**
 * Set profile posts has not data any more to show
 */
export const notMoreDataProfile = (userId) => {
  return {
    type: PostActionType.NOT_MORE_DATA_PROFILE,
    payload: {userId}
  }

}

/**
 * Set last page request of profile posts
 */
export const requestPageProfile = (userId, page) => {
  return {
    type: PostActionType.REQUEST_PAGE_PROFILE,
    payload: {userId, page}
  }

}

/**
 * Set last post identification of profile posts
 */
export const lastPostProfile = (userId, lastPostId) => {
  return {
    type: PostActionType.LAST_POST_PROFILE,
    payload: { userId, lastPostId}
  }

}
