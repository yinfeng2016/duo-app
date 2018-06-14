import * as d3 from 'd3';
import * as React from 'react';
import classAIcon from '../../../../images/ClassA_white.png';
import classBIcon from '../../../../images/ClassB_white.png';
import duoIcon from '../../../../images/Duo_white.png';
import ethIcon from '../../../../images/ethIcon.png';
import * as CST from '../../common/constants';
import { ColorStyles } from '../../common/styles';
import { IBalances, ICustodianStates } from '../../common/types';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardAssetTag, SCardExtendExtraDiv, SCardTitle } from './_styled';

interface IProps {
	account: string;
	balances: IBalances;
	states: ICustodianStates;
}

const BalanceInfo = (props: {
	icon: string;
	name: string;
	value: number;
	allowance?: number;
	totalSupply?: number;
}) => {
	const { icon, name, value, allowance, totalSupply } = props;
	return (
		<SCardAssetTag value={value}>
			<div className="bg-logo">
				<img src={icon} />
			</div>
			<div className="tag-title">
				<h3>{name}</h3>
			</div>
			<div className="tag-content">
				<div>
					<div>
						<div className={'tag-price'}>{value}</div>
						{allowance ? (
							<div style={{ color: 'white' }}>{allowance + ' allowance'}</div>
						) : null}
						{totalSupply ? (
							<div style={{ color: 'white' }}>{'Total Supply: ' + d3.format(',.2f')(totalSupply)}</div>
						) : null}
					</div>
				</div>
			</div>
		</SCardAssetTag>
	);
};

const ExtendExtraDiv = (props: { account: string }) => {
	const { account } = props;
	return (
		<SCardExtendExtraDiv color={account === 'Unknown' ? ColorStyles.TextRedAlpha : undefined}>
			<div className="extend-extra-wrapper">
				<div className="tag-title">Address</div>
				<div className="tag-content">{account}</div>
			</div>
		</SCardExtendExtraDiv>
	);
};

export default class BalanceCard extends React.Component<IProps> {
	public render() {
		const { balances, account, states } = this.props;
		return (
			<SCard
				title={<SCardTitle>BALANCE</SCardTitle>}
				width="690px"
				margin="0 0 0 10px"
				extra={<ExtendExtraDiv account={account ? account : 'Unknown'} />}
			>
				<SDivFlexCenter horizontal padding="0 10px">
					<BalanceInfo icon={ethIcon} name={CST.TH_ETH} value={balances.eth} />
					<BalanceInfo
						icon={duoIcon}
						name={CST.TH_DUO}
						value={balances.duo}
						allowance={balances.allowance}
					/>
					<BalanceInfo
						icon={classAIcon}
						name={CST.TH_TOKEN_A}
						value={balances.tokenA}
						totalSupply={states.totalSupplyA}
					/>
					<BalanceInfo
						icon={classBIcon}
						name={CST.TH_TOKEN_B}
						value={balances.tokenB}
						totalSupply={states.totalSupplyB}
					/>
				</SDivFlexCenter>
			</SCard>
		);
	}
}