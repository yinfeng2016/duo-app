import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import contractUtil from './common/contractUtil';
import * as contractActions from './actions/contractActions';
import * as dynamoActions from './actions/dynamoActions';
import Duo from './containers/DuoContainer';
import store from './store/store';

store.dispatch(contractActions.getCustodianStates());
store.dispatch(contractActions.getCustodianPrices());
store.dispatch(contractActions.getBalances());
store.dispatch(dynamoActions.fetchHourly());

ReactDOM.render(
	<Provider store={store}>
		<Duo />
	</Provider>,
	document.getElementById('app')
);
