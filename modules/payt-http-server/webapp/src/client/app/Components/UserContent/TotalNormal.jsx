import React from 'react';
import {render} from 'react-dom';

import GMap from '../Widgets/GMap.jsx';
import RowTwoWidgets from '../Widgets/Rows/RowTwoWidgets.jsx';
import LineChart from '../Widgets/Charts/LineChart.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class TotalNormal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
    		party: getParty(),
			strings: getAppState(),
			totalReal: 0,
			totalSimul: 0,
			totalRealMonths: [],
			totalSimulMonths: [],
			positions: []
    	};

		this._onChange = this._onChange.bind(this);
		this._onUserInfoChange = this._onUserInfoChange.bind(this); 
		this.setTotalReal.bind(this);
		this.setTotalSimul.bind(this);
		this.setTotalRealMonths.bind(this);
		this.setTotalSimulMonths.bind(this);
		this.setPositions = this.setPositions.bind(this);
		
		for(var i=0; i<this.state.party.producers.length; i++){
			var producer = this.state.party.producers[i];
			window.payt_session.call('payt.'+window.county+'.db.private.get_producer_real_bill', {args: [producer.id], callback: function (res){
					if(res != null)
						this.setTotalReal(res.value);
			}.bind(this),
					exchange: window.county
			});
		
			window.payt_session.call('payt.'+window.county+'.db.private.get_producer_simulated_bill', {args: [producer.id], callback: function (res){
					if(res != null)
						this.setTotalSimul(res.value);
			}.bind(this),
					exchange: window.county
			});

			window.payt_session.call('payt.'+window.county+'.db.private.get_producer_real_bills', {args: [producer.id,6], callback: function (res){
				if(res != null){
					res.forEach((el,index) => {
						this.setTotalRealMonths(index,el.value);
					});
				}
			}.bind(this),
					exchange: window.county
			});

			window.payt_session.call('payt.'+window.county+'.db.private.get_producer_simulated_bills', {args: [producer.id,6], callback: function (res){
				if(res != null){
					res.forEach((el,index) => {
						this.setTotalSimulMonths(index,el.value);
					});
				}
			}.bind(this),
					exchange: window.county
			});

			window.payt_session.call('payt.'+window.county+'.db.private.get_containers', {callback: function (res){
				var pos=[];
				var totLat = 0;
				var totLong = 0;
				var nCont = 0;
	
				res.forEach(container => {
					var tmp = [];
					if(!_.isEqual(container.location, [0,0])){
						nCont++;
						totLong += container.location[0];
						totLat += container.location[1];
	
						tmp.push(container.location[1]);
						tmp.push(container.location[0]);
						
						pos.push({id: container.id,coord: tmp});
					}
				});
				
				var cLat = totLat/nCont;
				var cLong = totLong/nCont;
				var c = [cLat,cLong];
	
				this.setPositions(pos,c);
			}.bind(this),
				exchange: window.county
			});
		}
	}

	setTotalReal(value){
		this.setState({totalReal: this.state.totalReal + value});
	}

	setTotalSimul(value){
		this.setState({totalSimul: this.state.totalSimul + value});
	}

	setTotalRealMonths(index,value){
		let tmp = this.state.totalRealMonths;
		let cur = tmp[index] || 0;
		tmp[index] = cur + value;

		this.setState({totalRealMonths: tmp});
	}

	setTotalSimulMonths(index,value){
		let tmp = this.state.totalSimulMonths;
		let cur = tmp[index] || 0;
		tmp[index] = cur + value;

		this.setState({totalSimulMonths: tmp});
	}

	setPositions(pos,c){
        this.setState({positions: pos, center: c});
    }

	// Listen for changes
	componentDidMount() {
		TranslationsStore.addChangeListener(this._onChange);
		UserInfoStore.addChangeListener(this._onUserInfoChange);
	}

	// Unbind change listener
	componentWillUnmount() {
		TranslationsStore.removeChangeListener(this._onChange);
		UserInfoStore.removeChangeListener(this._onUserInfoChange);
	}

	_onChange() {
		this.setState({strings:getAppState()});
	}

	_onUserInfoChange() {
		this.setState({party: getParty()});
	}

	render() {
		var unit = this.state.strings.TotalNormal.unit;
    	var values=[this.state.totalReal + unit, this.state.totalSimul + unit];
		var texts=[this.state.strings.TotalNormal.totalReal,this.state.strings.TotalNormal.totalSimul];
		var colors=["bg-green","bg-green disabled","bg-red","bg-yellow"];

    	var marker = L.icon({
			iconUrl: '/public/dist/img/bin.png',
			iconSize: [20, 30],
			iconAnchor: [22, 30],
			popupAnchor: [-12, -32],
	  	});

	  	var marker_name = this.state.strings.TotalNormal.markerName;

	  	const options = { 
	      	scales: {
		      xAxes: [{
	    			ticks: {
	    			  fontSize: 10
	    			}
				  }]
		    },
		    tooltips: {
		    	mode: 'x',
                callbacks: {
                    label: function(tooltipItem, data) {
                        return new String(tooltipItem.yLabel).replace(".",",") + ' €';
                    }
                }
            },
		    maintainAspectRatio: false,
	      	responsive:true
	  	};

		return (
			<div>
				<div className="row">
					<section className="col-lg-6">
						<GMap height={595} zoom={17} type='container' positions={this.state.positions} marker={marker} marker_name={marker_name} title={this.state.strings.TotalNormal.gmapTitle} enable={false}/>
					</section>
					<section className="col-lg-6">
    					<div className="row">
    						<RowTwoWidgets values={values} texts={texts} icons={["","","",""]} colors={colors}/>
    					</div>
    					<div className="row">
    						<div className="col-lg-12">
    							<LineChart height={435} text={this.state.strings.TotalNormal.lineChartTitle} options={options} totalRealMonths={this.state.totalRealMonths} totalSimulMonths={this.state.totalSimulMonths}/>
    						</div>
    					</div>
					</section>
				</div>
			</div>
		);
	}
}

module.exports = TotalNormal;