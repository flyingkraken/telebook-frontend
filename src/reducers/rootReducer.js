import { localeReducer as locale } from 'react-localize-redux'
import {
  combineReducers
} from 'redux-immutable'

// - Import reducers
import { authorizeReducer } from './authorizeReducer'
import { circleReducer } from './circleReducer'
// import { commentReducer } from './comments'
import { globalReducer } from './globalReducer'
// import { imageGalleryReducer } from './imageGallery'
import { notificationReducer } from './notificationReducer'
import { postReducer } from './postReducer'
import { userReducer } from './userReducer'
// import { voteReducer } from './votes'
import { serverReducer } from './serverReducer'
import { connectRouter } from 'connected-react-router/immutable'

// - Reducers
export const rootReducer = (history) => combineReducers({
    locale,
    // imageGallery: imageGalleryReducer,
    post: postReducer,
    circle: circleReducer,
    // comment: commentReducer,
    // vote: voteReducer,
    server: serverReducer,
    authorize: authorizeReducer,
    router: connectRouter(history),
    user: userReducer,
    notify: notificationReducer,
    global: globalReducer
  })