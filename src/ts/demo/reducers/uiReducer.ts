import { AnyAction } from 'redux';
import calculator from '../common/calculator';
import * as CST from '../common/constants';
import { IRawData, IUIState } from '../common/types';
const rawData: IRawData[] = require('../../../static/ETH.json');

const [e, a, b, rp, bt, up, down, period] = calculator.getAllTimeSeriesFromEth(rawData);

export const initialState: IUIState = {
	eth: e,
	classA: a,
	classB: b,
	resetPrice: rp,
	beta: bt,
	upward: up,
	downward: down,
	periodic: period,
	trades: [],
	message: {
		type: '',
		content: '',
		visible: false
	},
	setting: {
		couponRate: 0.0002,
		upwardResetLimit: 2,
		downwardResetLimit: 0.25,
		periodicResetLimit: 1.02
	},
	form: {
		type: '',
		visible: false
	},
	mv: [{ datetime: e[0].datetime, value: e[0].value * 100 }],
	assets: {
		ETH: 100,
		ClassA: 0,
		ClassB: 0
	},
	day: 0,
	price: {
		Date: e[0].datetime,
		ETH: e[0].value,
		ClassA: a[0].value,
		ClassB: b[0].value
	}
};

export function uiReducer(state: IUIState = initialState, action: AnyAction): IUIState {
	const { eth, classA, classB, resetPrice, beta, upward, downward, periodic, setting } = state;
	switch (action.type) {
		case CST.AC_REFRESH:
			return Object.assign({}, initialState, {
				setting,
				eth,
				classA,
				classB,
				resetPrice,
				beta,
				upward,
				downward,
				periodic
			});
		case CST.AC_MESSAGE:
			return Object.assign({}, state, {
				[CST.AC_MESSAGE]: action.value
			});
		case CST.AC_SETTING:
			const newSetting: any = action.value;
			const [ne, na, nb, nrp, nbt, nup, ndown, nperiod] = calculator.getAllTimeSeriesFromEth(
				rawData,
				1,
				newSetting.couponRate,
				newSetting.upwardResetLimit,
				newSetting.downwardResetLimit,
				newSetting.periodicResetLimit
			);
			return Object.assign({}, initialState, {
				[CST.AC_SETTING]: newSetting,
				eth: ne,
				classA: na,
				classB: nb,
				resetPrice: nrp,
				beta: nbt,
				upward: nup,
				downward: ndown,
				periodic: nperiod
			});
		case CST.AC_FORM:
			return Object.assign({}, state, {
				[CST.AC_FORM]: action.value
			});
		case CST.AC_TRADE:
			return Object.assign({}, state, {
				trades: [...state.trades, action.trade],
				[CST.AC_ASSETS]: action.assets
			});
		case CST.AC_NEXT:
			return Object.assign({}, state, calculator.calculateNextDayState(state));
		case CST.AC_FWD:
			return Object.assign({}, state, calculator.calculateForwardState(state));
		default:
			return state;
	}
}
