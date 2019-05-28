import React from 'react';
import {render} from 'react-dom';

import RowAddress from '../Widgets/Rows/RowAddress.jsx';
import SimpleBarChart from '../Widgets/Charts/SimpleBarChart.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class NormalContent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
	        party: getParty(),
	        index: props.match.params.id,
	        rawData: [],
	        strings: getAppState()
	    };

		this.setRawData = this.setRawData.bind(this);
		this._onChange = this._onChange.bind(this);
		this._onUserInfoChange = this._onUserInfoChange.bind(this);

		var start_date = moment().subtract(12,'months').toDate();
		var end_date = moment().toDate();
		var id = this.state.party.producers[this.state.index].id;
		
		window.payt_session.call('payt.'+window.county+'.db.private.get_producer_waste_total', {args: [id,start_date,end_date], callback: function (res){
			this.setRawData(res);
		}.bind(this),
			exchange: window.county
		});
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

	setRawData(val){
		this.setState({rawData: val});
	}

	render() {
		var values = this.state.rawData;

		var dataValues = [];
		var dataLabels = [];

		for(var i=0; i<values.length; i++){
			var dic = values[i];
			var date = dic['date'].split('-');
		  	dataValues.push(dic['waste']['TOTAL']);
		  	dataLabels.push(this.state.strings.Months[parseInt(date[1])-1]+' '+date[0]);
		}


		const data = {
	        labels: dataLabels,
	        datasets: [
	          {
		          label: this.state.strings.NormalContent.dataLabel,
		          backgroundColor: 'rgba(0, 166, 90, 0.7)',
	              borderColor: 'rgba(0, 166, 90, 1)',
	              borderWidth: 1,
	              hoverBackgroundColor: 'rgba(0, 166, 90, 1)',
	              hoverBorderColor: 'rgba(0, 166, 90, 1)',
	           	  data: dataValues
	          }]
	    };

	    const options = { 
	      scales: {
	        xAxes: 	[{
				      	ticks: {
				        	fontSize: 10
				      	}
				   	}],
			yAxes: 	[{
						ticks: {
							min: 0
						},
						scaleLabel: {
							display: true,
							labelString: this.state.strings.NormalContent.dataLabel + ' (L)'
						}
					}]
		  },
		  tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    return new String(tooltipItem.yLabel).replace(".",",") + ' L';
                }
            }
          },
	      maintainAspectRatio: false,
	      responsive:true
	    };

		return (
			<div>
				<div className="row"><RowAddress producer_id={this.state.party.producers[this.state.index].id} index={this.state.index}/></div>
				<div className="row"><section className="col-lg-12" ><SimpleBarChart data={data} options={options} text={this.state.strings.NormalContent.textChart}/></section></div>
			</div>
		);
	}
}

module.exports = NormalContent;