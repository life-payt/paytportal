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

class TotalNormalBusiness extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        party: getParty(),
        strings: getAppState(),
        totalReal: 0,
        totalSimul: 0,
        totalRealMonths: [],
			  totalSimulMonths: []
    };

    this._onChange = this._onChange.bind(this);
    this._onUserInfoChange = this._onUserInfoChange.bind(this); 
    this.setTotalReal.bind(this);
    this.setTotalSimul.bind(this);
    this.setTotalRealMonths.bind(this);
		this.setTotalSimulMonths.bind(this);
    
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
    var unit = this.state.strings.TotalNormalBusiness.unit; // ' €'
    var values=[this.state.totalReal + unit, this.state.totalReal + unit];
    var texts=[this.state.strings.TotalNormalBusiness.totalReal,this.state.strings.TotalNormalBusiness.totalSimul];
    var icons=["ion ion-cash","ion ion-ios-game-controller-b","fa fa-thumbs-o-up","fa fa-comments-o"];
    var colors=["bg-green","bg-green disabled","bg-red","bg-yellow"];

    const options = { 
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 10
          }
        }]
      },
      maintainAspectRatio: false,
      responsive:true
    };

    var positions = [[38.720964, -9.153455],[38.736741, -9.121194]];

    var pos=[];

    for(var i=0;i<positions.length;i++){
      if(positions[i]){
        pos.push({id: i, coord: positions[i]});
      }
    }

    /*
    var marker = L.icon({
      iconUrl: '/public/dist/img/factory.png',
      iconSize: [20, 30],
      iconAnchor: [22, 30],
      popupAnchor: [-12, -32],
    });*/

    var marker_name=this.state.strings.TotalNormalBusiness.markerName;

    return (
      <div className="row">
          <section className="col-lg-6"><GMap height={595} zoom={13} type='factory' positions={pos} marker_name={marker_name} title={this.state.strings.TotalNormalBusiness.gmapTitle} enable={true}/></section>
          <section className="col-lg-6">
            <div className="row">
              <RowTwoWidgets values={values} texts={texts} icons={["","","",""]} colors={colors}/>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <LineChart height={435} options={options} text={this.state.strings.TotalNormalBusiness.lineChartTitle} totalRealMonths={this.state.totalRealMonths} totalSimulMonths={this.state.totalSimulMonths}/>
              </div>
            </div>
          </section>
          <section className="col-lg-12">
            <div className="row">
              <div className="col-lg-12" id="detailsProducers"></div>
            </div>
            <div className="row">
              <div className="col-lg-12" id="containersBarChart"></div>
            </div>
        </section>
      </div>
    );
  }
}

module.exports = TotalNormalBusiness;