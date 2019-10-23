import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, NavLink, withRouter, Redirect } from 'react-router-dom'
import { push } from 'react-router-redux'
import Snackbar from 'material-ui/Snackbar'
import { LinearProgress } from 'material-ui/Progress'

// - Import components

import MasterLoadingComponent from './MasterLoadingComponent'
import MasterRouter from 'routes/MasterRouter'
// import { ServiceProvide, IServiceProvider } from 'core/factories'
// import { IAuthorizeService } from 'core/services/authorize'

// // - Import actions
import {
  authorizeActions,
  postActions,
  userActions,
  globalActions,
  circleActions,
  notifyActions
} from '../../actions'

/* ------------------------------------ */

// - Create Master component class
export class MasterComponent extends Component {

  static isPrivate = true

  // var _serviceProvider
  // var _authourizeService
  // Constructor
  constructor (props) {
    super(props)

    // this._serviceProvider = new ServiceProvide()
    // this._authourizeService = this._serviceProvider.createAuthorizeService()
    this.state = {
      loading: true,
      authed: false,
      dataLoaded: false,
      isVerifide: false
    }

    // Binding functions to `this`
    this.handleLoading = this.handleLoading.bind(this)
    this.handleMessage = this.handleMessage.bind(this)

  }

  // Handle click on message
  handleMessage = (evt) => {
    this.props.closeMessage()
  }

  // Handle loading
  handleLoading = (status) => {
    this.setState({
      loading: status,
      authed: false
    })
  }

  componentDidMount () {

    // this._authourizeService.onAuthStateChanged((isVerifide, user) => {
    //   const {
    //     global,
    //     clearData,
    //     loadDataGuest,
    //     defaultDataDisable,
    //     defaultDataEnable,
    //     login,
    //     logout,
    //     showMasterLoading,
    //     hideMasterLoading
    //   } = this.props
    //   if (user) {
    //     login(user.uid,isVerifide)
    //     hideMasterLoading!()
    //     this.setState({
    //       loading: false,
    //       isVerifide: true
    //     })

    //   } else {
    //     logout()
    //     hideMasterLoading!()
    //     this.setState({
    //       loading: false,
    //       isVerifide: false
    //     })
    //     if (global.defaultLoadDataStatus) {
    //       defaultDataDisable()
    //       clearData()
    //     }
    //     loadDataGuest()
    //   }
    // })

  }

  /**
   * Render app DOM component
   *
   * @returns
   *
   * @memberof Master
   */
  render () {

    const { progress, global, loaded, guest, uid, hideMessage } = this.props
    const { loading, isVerifide } = this.state

    return (
      <div id='master'>
        <div className='master__progress' style={{ display: (progress.visible ? 'block' : 'none') }}>
          <LinearProgress variant='determinate' value={progress.percent} />
        </div>
        <div className='master__loading animate-fading2' style={{ display: (global.showTopLoading ? 'flex' : 'none') }}>
          <div className='title'>Loading ... </div>
        </div>
        <MasterLoadingComponent activeLoading={global.showMasterLoading} handleLoading={this.handleLoading} />
      <MasterRouter enabled={!loading} data={{uid}} />
        <Snackbar
          open={this.props.global.messageOpen}
          message={this.props.global.message}
          onClose={hideMessage}
          autoHideDuration={4000}
          style={{ left: '1%', transform: 'none' }}
        />
      </div>

    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clearData: () => {
      dispatch(postActions.clearAllData())
      dispatch(userActions.clearAllData())
      dispatch(notifyActions.clearAllNotifications())
      dispatch(circleActions.clearAllCircles())
      dispatch(globalActions.clearTemp())
    },
    login: (userId, isVerifide) => {
      dispatch(authorizeActions.login(userId, isVerifide))
    },
    logout: () => {
      dispatch(authorizeActions.logout())
    },
    defaultDataDisable: () => {
      dispatch(globalActions.defaultDataDisable())
    },
    defaultDataEnable: () => {
      dispatch(globalActions.defaultDataEnable())
    },
    closeMessage: () => {
      dispatch(globalActions.hideMessage())
    },
    loadDataGuest: () => {
      dispatch(globalActions.loadDataGuest())
    },
    showMasterLoading: () => dispatch(globalActions.showMasterLoading()),
    hideMasterLoading: () => dispatch(globalActions.hideMasterLoading()),
    hideMessage: () => dispatch(globalActions.hideMessage())
  }

}

const mapStateToProps = (state) => {
  const { authorize, global, user, post, notify, circle } = state
  return {
    guest: authorize.guest,
    uid: authorize.uid,
    authed: authorize.authed,
    progress: global.progress,
    global: global
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MasterComponent))
