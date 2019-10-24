import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

import config from './config'

import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import { ConnectedRouter } from 'react-router-redux'

import './styles/index.css';
import MasterComponent from './components/master/MasterComponent';

import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
	  primary: { main: config.theme.primaryColor },
	  secondary: { main: config.theme.secondaryColor }
  }
})

ReactDOM.render(
		<Provider store={configureStore.store}>
			<ConnectedRouter history={configureStore.history}>
				<MuiThemeProvider theme={theme}>
					<MasterComponent />
				</MuiThemeProvider>
			</ConnectedRouter>
		</Provider>,
	document.getElementById('root')
)

serviceWorker.register();
