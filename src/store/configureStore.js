// - Import external components
import * as redux from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { rootReducer } from '../reducers/rootReducer'

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory()

// - initial state
let initialState = {

}

// - Config and create store of redux
let store = redux.createStore(rootReducer, initialState, redux.compose(
  redux.applyMiddleware(thunk, routerMiddleware(history))
))

export default {store, history}
