import { Table, Tooltip } from 'antd';
import * as d3 from 'd3';
import moment from 'moment';
import * as React from 'react';
import * as CST from '../../common/constants';
import { IConversion } from '../../common/types';
import { SCard, SCardTitle, STableWrapper } from './_styled';

const { Column } = Table;

interface IProps {
	conversion: IConversion[];
}

export default class ConversionCard extends React.PureComponent<IProps> {
	public render() {
		const { conversion } = this.props;
		return (
			<SCard
				title={<SCardTitle>{CST.TH_CONVERSION.toUpperCase()}</SCardTitle>}
				width="740px"
				margin="0 10px 0 0"
				inlinetype="table"
			>
				<STableWrapper>
					<Table
						dataSource={conversion.map(c => ({
							key: c.transactionHash,
							[CST.TH_TIME]: moment(c.timestamp).format('YYYY-MM-DD HH:mm:ss'),
							[CST.TH_STATUS]: c.pending ? CST.TH_PENDING : CST.TH_MINED,
							[CST.TH_TYPE]: c.type,
							[CST.TH_ETH]: d3.format(',.8f')(c.eth),
							[CST.TH_TOKEN_AB]: d3.format(',.8f')(c.tokenA),
							[CST.TH_FEE]: c.duoFee
								? d3.format(',.8f')(c.duoFee) + ' ' + CST.TH_DUO
								: d3.format(',.8f')(c.ethFee) + ' ' + CST.TH_ETH,
							[CST.TH_LINK]:
								'https://' +
								(__KOVAN__ ? 'kovan.' : '') +
								'etherscan.io/tx/' +
								c.transactionHash
						}))}
						pagination={{
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total: number) => 'Total ' + total + ' Conversions',
							pageSize: 10,
							pageSizeOptions: ['10', '20', '50'],
							size: 'small'
						}}
						onRow={record => ({
							onClick: () => window.open(record[CST.TH_LINK])
						})}
						rowClassName={record => record[CST.TH_TYPE]}
					>
						<Column
							title={CST.TH_TIME}
							dataIndex={CST.TH_TIME}
							key={CST.TH_TIME}
							sorter={(a, b) =>
								-(a[CST.TH_TIME] as string).localeCompare(b[CST.TH_TIME])
							}
							width={160}
						/>
						<Column
							title={CST.TH_STATUS}
							dataIndex={CST.TH_STATUS}
							key={CST.TH_STATUS}
							filters={[CST.TH_MINED, CST.TH_PENDING].map(f => ({
								text: f,
								value: f
							}))}
							filterMultiple={false}
							onFilter={(value, record) => record[CST.TH_STATUS] === value}
							width={90}
							render={(text, record) =>
								record[CST.TH_TOOLTIP] ? (
									<Tooltip title={record[CST.TH_TOOLTIP]}>{text}</Tooltip>
								) : (
									text
								)
							}
						/>
						<Column
							title={CST.TH_TYPE}
							dataIndex={CST.TH_TYPE}
							key={CST.TH_TYPE}
							filters={[CST.EVENT_CREATE, CST.EVENT_REDEEM].map(f => ({
								text: f,
								value: f
							}))}
							filterMultiple={false}
							onFilter={(value, record) => record[CST.TH_TYPE] === value}
							width={90}
						/>
						<Column
							title={CST.TH_ETH}
							dataIndex={CST.TH_ETH}
							key={CST.TH_ETH}
							className="eth"
						/>
						<Column
							title={CST.TH_TOKEN_AB}
							dataIndex={CST.TH_TOKEN_AB}
							key={CST.TH_TOKEN_AB}
							className="token-ab"
						/>
						<Column
							title={CST.TH_FEE}
							dataIndex={CST.TH_FEE}
							key={CST.TH_FEE}
							className="fee"
							width={140}
						/>
					</Table>
				</STableWrapper>
			</SCard>
		);
	}
}
