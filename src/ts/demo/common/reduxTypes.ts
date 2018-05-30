import { IAssets, IPriceData, ITimeSeriesData } from './types';
export interface IState {
	ui: IUIState;
}

export interface IUIState {
	eth: ITimeSeriesData[];
	classA: ITimeSeriesData[];
	classB: ITimeSeriesData[];
	resetPrice: ITimeSeriesData[];
	beta: ITimeSeriesData[];
	upward: ITimeSeriesData[];
	downward: ITimeSeriesData[];
	periodic: ITimeSeriesData[];
	trades: string[];
	message: {
		type: string;
		content: string;
		visible: boolean;
	};
	setting: {
		couponRate: number;
		upwardResetLimit: number;
		downwardResetLimit: number;
		periodicResetLimit: number;
	};
	form: {
		type: string;
		visible: boolean;
	};
	mv: ITimeSeriesData[];
	assets: IAssets;
	day: number;
	price: IPriceData;
}

export type Action =
	| IBaseAction
	| IBooleanAction
	| IStringAction
	| IObjectAction
	| INumberAction
	| ITradeAction;

export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;

export interface IBaseAction {
	type: string;
}

export interface IBooleanAction {
	type: string;
	value: boolean;
}

export interface IStringAction {
	type: string;
	value: string;
}

export interface IObjectAction {
	type: string;
	value: object;
}

export interface INumberAction {
	type: string;
	value: number;
}

export interface ITradeAction {
	type: string;
	trade: string;
	assets: IAssets;
}

export type ThunkAction = (dispatch: Dispatch) => any;
export type PromiseAction = Promise<Action>;