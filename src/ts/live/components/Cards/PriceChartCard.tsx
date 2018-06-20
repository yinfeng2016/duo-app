import * as d3 from 'd3';
import moment from 'moment';
import * as React from 'react';
import { IAcceptedPrice, IPriceBar, ISourceData } from '../../common/types';
import { SDivFlexCenter } from '../_styled';
import CardTitleDropdown from '../Common/CardTitleDropdown';
import { SCard } from './_styled';

const margin = { top: 12, right: 23, bottom: 20, left: 32 };

interface IProps {
	hourly: ISourceData<IPriceBar[]>;
	minutely: ISourceData<IPriceBar[]>;
	prices: IAcceptedPrice[];
}

interface IState {
	keys: string[];
	timeStep: number;
}

function drawLines(
	el: Element,
	custodianData: IAcceptedPrice[],
	sourceData: ISourceData<IPriceBar[]>,
	timeStep: number
) {
	console.log(el);
	console.log(custodianData);
	console.log(sourceData);
	console.log(timeStep);
	if (!custodianData.length) return;
	const width = 708 - margin.left - margin.right;
	const height = 350 - margin.top - margin.bottom;

	//Establish SVG Playground
	d3.selectAll('#timeserieschart').remove();
	d3.select(el)
		.append('svg')
		.attr('id', 'timeserieschart')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom);

	//Date Range
	const zoomFormat = date => moment(date).format('HH:mm');
	const displayColums = (step: number) => {
		switch (step) {
			case 60000:
				return 120;
			default:
				return 168;
		}
	};
	const maxDate =
		d3.max(
			[
				custodianData[custodianData.length - 1].timestamp,
				sourceData.bitfinex[sourceData.bitfinex.length - 1].timestamp,
				sourceData.gemini[sourceData.gemini.length - 1].timestamp,
				sourceData.kraken[sourceData.kraken.length - 1].timestamp,
				sourceData.gdax[sourceData.gdax.length - 1].timestamp
			]
		) || 0;
	const minDate = maxDate - timeStep * displayColums(timeStep);
	//Time Scale
	const xStart = minDate - 2 * timeStep;
	const xEnd = maxDate + 2 * timeStep;
	console.log(xStart);
	console.log(xEnd);
	const xScale = d3
		.scaleTime()
		.domain([xStart, xEnd])
		.range([0, width]);
	const rectWidth =
		(xScale(moment('2000-01-01').valueOf() + timeStep) -
			xScale(moment('2000-01-01').valueOf())) *
		0.85;
	console.log(rectWidth);
	//Data Range (ETH price)
	const maxPrice =
		d3.max(
			[
				d3.max(
					[...custodianData.map(d => d.price)].slice(
						custodianData.length - displayColums(timeStep)
					)
				) || 0,
				d3.max(
					[...sourceData.bitfinex.map(d => d.high)].slice(
						sourceData.bitfinex.length - displayColums(timeStep)
					)
				) || 0,
				d3.max(
					[...sourceData.gemini.map(d => d.high)].slice(
						sourceData.gemini.length - displayColums(timeStep)
					)
				) || 0,
				d3.max(
					[...sourceData.kraken.map(d => d.high)].slice(
						sourceData.kraken.length - displayColums(timeStep)
					)
				) || 0,
				d3.max(
					[...sourceData.gdax.map(d => d.high)].slice(
						sourceData.gdax.length - displayColums(timeStep)
					)
				) || 0
			]
		) || 0;
	const minPrice =
		d3.min(
			[
				d3.min(
					[...custodianData.map(d => d.price)].slice(
						custodianData.length - displayColums(timeStep)
					)
				) || 0,
				d3.min(
					[...sourceData.bitfinex.map(d => d.low)].slice(
						sourceData.bitfinex.length - displayColums(timeStep)
					)
				) || 0,
				d3.min(
					[...sourceData.gemini.map(d => d.low)].slice(
						sourceData.gemini.length - displayColums(timeStep)
					)
				) || 0,
				d3.min(
					[...sourceData.kraken.map(d => d.low)].slice(
						sourceData.kraken.length - displayColums(timeStep)
					)
				) || 0,
				d3.min(
					[...sourceData.gdax.map(d => d.low)].slice(
						sourceData.gdax.length - displayColums(timeStep)
					)
				) || 0
			]
		) || 0;
	const rangeTop = maxPrice + 0.1 * (maxPrice - minPrice);
	const rangeBottom = d3.max([0, minPrice - 0.1 * (maxPrice - minPrice)]) || 0;
	console.log(maxPrice);
	console.log(minPrice);
	console.log(rangeTop);
	console.log(rangeBottom);
	//Data Range (Nav A/B)
	const slicedCustodianData = custodianData.slice(custodianData.length - displayColums(timeStep));
	const maxNav =
		d3.max(
			[...slicedCustodianData.map(d => d.navA), ...slicedCustodianData.map(d => d.navB)]
		) || 0;
	const minNav =
		d3.min(
			[...slicedCustodianData.map(d => d.navA), ...slicedCustodianData.map(d => d.navB)]
		) || 0;
	const rangeTopNav = maxNav + 0.1 * (maxNav - minNav);
	const rangeBottomNav = d3.max([0, minNav - 0.1 * (maxNav - minNav)]) || 0;
	console.log(maxNav);
	console.log(minNav);
	console.log(rangeTopNav);
	console.log(rangeBottomNav);
	//ETH Linear YScale
	const ethYScale = d3
		.scaleLinear()
		.domain([rangeBottom, rangeTop])
		.range([height, 0]);
	//Nav A/B Linear YScale
	const navYScale = d3
		.scaleLinear()
		.domain([rangeBottomNav, rangeTopNav])
		.range([height, 0]);
	//Lines
	// const lineSource = d3
	// 	.line<IPriceBar>()
	// 	.x(d => xScale(d.timestamp))
	// 	.y(d => ethYScale(d.close));
	// const lineCustodian = d3
	// 	.line<IAcceptedPrice>()
	// 	.x(d => xScale(d.timestamp))
	// 	.y(d => ethYScale(d.price));
	// const lineNavA = d3
	// 	.line<IAcceptedPrice>()
	// 	.x(d => xScale(d.timestamp))
	// 	.y(d => navYScale(d.navA));
	// const lineNavB = d3
	// 	.line<IAcceptedPrice>()
	// 	.x(d => xScale(d.timestamp))
	// 	.y(d => navYScale(d.navB));
	//Axis
	const xAxis = d3
		.axisBottom(xScale)
		.ticks(6)
		.tickFormat(zoomFormat);
	const lyAxis = d3.axisLeft(ethYScale).ticks(5);
	const ryAxis = d3.axisRight(navYScale).ticks(5);

	//Chart
	const chart = d3
		.select(el)
		.select('#timeserieschart')
		.append('g')
		.attr('class', 'graph-area')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	const aX = chart
		.append('g')
		.attr('class', 'x-axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis as any);
	aX.selectAll('text').style('text-anchor', 'middle');
	chart
		.append('g')
		.attr('class', 'ly-axis')
		.call(lyAxis as any);
	const raY = chart
		.append('g')
		.attr('class', 'ry-axis')
		.attr('transform', 'translate(' + width + ', 0)')
		.call(ryAxis as any);
	raY.selectAll('text').style('text-anchor', 'start');
}

export default class PriceChartCard extends React.Component<IProps, IState> {
	private chartRef: any;
	constructor(props: IProps) {
		super(props);
		this.state = {
			keys: [],
			timeStep: 60000
		};
		this.chartRef = React.createRef();
	}

	private handlePickSource = (key: string) => {
		const { keys } = this.state;
		const index = keys.indexOf(key);
		if (index >= 0)
			this.setState({ keys: [...keys.slice(0, index), ...keys.slice(index + 1)] });
		else this.setState({ keys: [...keys, key] });
	};

	public componentDidMount() {
		const { minutely, prices } = this.props;
		const { timeStep } = this.state;
		drawLines(this.chartRef.current as Element, prices, minutely, timeStep);
	}

	public shouldComponentUpdate(nextProps: IProps) {
		if (
			JSON.stringify(nextProps.minutely) !== JSON.stringify(this.props.minutely) ||
			JSON.stringify(nextProps.hourly) !== JSON.stringify(this.props.hourly) ||
			JSON.stringify(nextProps.prices) !== JSON.stringify(this.props.prices)
		) {
			const { minutely, prices } = nextProps;
			const { timeStep } = this.state;
			drawLines(this.chartRef.current as Element, prices, minutely, timeStep);
		}
		return false;
	}

	public render() {
		const { keys } = this.state;
		return (
			<SCard
				title={
					<CardTitleDropdown
						name="TIME SERIES"
						keys={keys}
						handlePickSource={this.handlePickSource}
					/>
				}
				width="760px"
				margin="0 10px 0 0"
			>
				<SDivFlexCenter horizontal padding="0 10px">
					<div className="chart-wrapper" ref={this.chartRef} />
				</SDivFlexCenter>
			</SCard>
		);
	}
}
