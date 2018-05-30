import Web3 from 'web3';
import { Contract } from 'web3/types';
import custodianAbi from '../../../../../duo-admin/src/static/Custodian.json';
import duoAbi from '../../../../../duo-admin/src/static/DUO.json';
import { ICustodianPrice, ICustodianStates } from '../common/types';
import * as CST from './constants';
//import util from './util';
//const Tx = require('ethereumjs-tx');
//const abiDecoder = require('abi-decoder');

class ContractUtil {
	private web3: Web3;
	private duo: Contract;
	private custodian: Contract;
	public isReadOnly: boolean;

	constructor() {
		if (typeof (window as any).web3 !== 'undefined') {
			this.isReadOnly = false;
			this.web3 = new Web3((window as any).web3.currentProvider);
		} else {
			this.web3 = new Web3(
				new Web3.providers.HttpProvider(
					__DEV__ ? CST.PROVIDER_INFURA_LIVE : CST.PROVIDER_INFURA_DEV
				)
			);
			this.isReadOnly = true;
		}
		this.custodian = new this.web3.eth.Contract(custodianAbi.abi, CST.CUSTODIAN_ADDR);
		this.duo = new this.web3.eth.Contract(duoAbi.abi, CST.DUO_CONTRACT_ADDR);
	}

	public async read(name: string): Promise<string> {
		return await this.custodian.methods[name]().call();
	}

	public convertCustodianState(rawState: string) {
		switch (rawState) {
			case '0':
				return 'Inception';
			case '1':
				return 'Trading';
			case '2':
				return 'PreReset';
			case '3':
				return 'UpwardReset';
			case '4':
				return 'DownwardReset';
			case '5':
				return 'PeriodicReset';
			default:
				return 'Unknown';
		}
	}

	public async getSystemStates(): Promise<ICustodianStates> {
		const states = await this.custodian.methods.getSystemStates().call();
		return {
			state: this.convertCustodianState(states[0].valueOf()),
			navA: this.fromWei(states[1]),
			navB: this.fromWei(states[2]),
			totalSupplyA: this.fromWei(states[3]),
			totalSupplyB: this.fromWei(states[4]),
			alpha: states[5].valueOf() / 10000,
			beta: this.fromWei(states[6]),
			// feeAccumulated: this.fromWei(states[7]),
			periodCoupon: this.fromWei(states[8]),
			limitPeriodic: this.fromWei(states[9]),
			limitUpper: this.fromWei(states[10]),
			limitLower: this.fromWei(states[11]),
			commissionRate: states[12] / 10000,
			period: states[13].valueOf(),
			// iterationGasThreshold: states[14].valueOf(),
			ethDuoFeeRatio: states[15].valueOf(),
			preResetWaitingBlocks: states[16].valueOf(),
			// priceTol: states[17].valueOf() / 10000,
			// priceFeedTol: states[18].valueOf() / 10000,
			// priceFeedTimeTol: states[19].valueOf(),
			// priceUpdateCoolDown: states[20].valueOf(),
			// numOfPrices: states[21].valueOf(),
			nextResetAddrIndex: states[22].valueOf(),
			// lastAdminTime: states[23].valueOf(),
			// adminCoolDown: states[24],
			usersLength: states[25].valueOf()
			// addrPoolLength: states[26].valueOf()
		};
	}

	public async getSystemPrices(): Promise<ICustodianPrice[]> {
		const prices = await this.custodian.methods.getSystemPrices().call();
		return [0, 1].map(i => ({
			address: prices[6 + i * 3].valueOf(),
			price: this.fromWei(prices[7 + i * 3]),
			timestamp: prices[8 + i * 3].valueOf()
		}));
	}

	public async getGasPrice(): Promise<number> {
		return await this.web3.eth.getGasPrice();
	}

	public async getCurrentAddress(): Promise<string> {
		return (await this.web3.eth.getAccounts())[0];
	}

	public async getEthBalance(address: string): Promise<number> {
		return this.fromWei(await this.web3.eth.getBalance(address));
	}

	public async getDuoBalance(address: string): Promise<number> {
		return this.fromWei(await this.duo.methods.balanceOf(address).call());
	}

	public async getDuoAllowance(address: string): Promise<number> {
		return this.fromWei(await this.duo.methods.allowance(address, CST.CUSTODIAN_ADDR).call());
	}

	public async getTokenBalance(address: string, isA: boolean): Promise<number> {
		return this.fromWei(await this.custodian.methods.balancesOf(isA ? 0 : 1, address).call());
	}

	public fromWei(value: string | number) {
		return this.web3.utils.fromWei(value, 'ether');
	}
}

const contractUtil = new ContractUtil();
export default contractUtil;