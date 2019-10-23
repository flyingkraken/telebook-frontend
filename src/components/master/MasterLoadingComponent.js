// - Import react components
import React, { Component } from 'react'
import { CircularProgress } from 'material-ui/Progress'
import Dialog from 'material-ui/Dialog'

export default class MasterLoadingComponent {
  // Render app DOM component
  render () {
    const {activeLoading} = this.props
    return (
      <div className='mLoading__loading' style={{ display: (activeLoading ? 'flex' : 'none') }}>
         <CircularProgress
        color='secondary'
        size={50}
        variant='determinate'
        value={25}
        min={0}
        max={50}
      />
      </div>
    )
  }
}
