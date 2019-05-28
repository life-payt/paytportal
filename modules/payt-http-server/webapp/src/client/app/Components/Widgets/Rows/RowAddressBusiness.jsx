import React from 'react';
import {render} from 'react-dom';

import BigWidgetBusiness from '../BigWidget.jsx';
import Widget from '../Widget.jsx';
import ContainerKnobWidget from '../Containers/ContainerKnobWidget.jsx';
import Spinner from 'react-spin';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../../Flux/Stores/UserInfoStore');

var moment = require('moment');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class RowAddressBusiness extends React.Component {
    constructor(props){
      super(props);
      this.state = { 
  			party: getParty(), 
  			producer_id: props.producer_id,
  			index: props.index,
  			real: '---',
  			simul: '---',
  			stoppedWidget1: false,
  			stoppedWidget2: false,
  			selfAvg: 0,
  			regAvg: 0,
  			stoppedAvg1: false,
  			stoppedAvg2: false,
        strings: getAppState()
  		};

			this._onChange = this._onChange.bind(this);
			this._onUserInfoChange = this._onUserInfoChange.bind(this);

      this.setReal.bind(this);
  		this.setSimul.bind(this);
  		this.setSelfAvg.bind(this);
  		this.setRegAvg.bind(this);

  		window.payt_session.call('payt.'+window.county+'.db.private.get_producer_real_bill', {args: [this.state.producer_id], callback: function (res){
  			if(res != null)
					this.setReal(res.value + this.state.strings.RowAddressBusiness.unit );
				else
					this.setReal(this.state.strings.RowAddress.errorMsg);
  		}.bind(this),
        exchange: window.county
      });

  		window.payt_session.call('payt.'+window.county+'.db.private.get_producer_simulated_bill', {args: [this.state.producer_id], callback: function (res){
  			if(res != null)
					this.setSimul(res.value + this.state.strings.RowAddressBusiness.unit );
				else
					this.setSimul(this.state.strings.RowAddress.errorMsg);
  		}.bind(this),
        exchange: window.county
      });

  		window.payt_session.call('payt.'+window.county+'.db.private.get_producer_day_average', {args: [this.state.producer_id], callback: function (res){
  			if(res != null)
  				this.setSelfAvg(res['TOTAL']);
  		}.bind(this),
        exchange: window.county
      });

  		window.payt_session.call('payt.'+window.county+'.db.private.get_producer_zone_day_average', {args: [this.state.producer_id], callback: function (res){
  			if(res != null)
  				this.setRegAvg(res['TOTAL']);
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

    setReal(real){
    	this.setState({
    		real: real,
    		stoppedWidget1: true
    	});
    }

    setSimul(simul){
    	this.setState({
    		simul: simul,
    		stoppedWidget2: true
    	});
    }

    setSelfAvg(avg){
    	if(avg != null){
	    	this.setState({
	    		selfAvg: avg,
	    		stoppedAvg1: true
	    	});
	    }
    }

    setRegAvg(avg){
    	if(avg != null){
	    	this.setState({
	    		regAvg: avg,
	    		stoppedAvg2: true
	    	});
	    }
    }

    render(){
    	var opts = {
  			  lines: 13 // The number of lines to draw
  			, length: 30 // The length of each line
  			, width: 2 // The line thickness
  			, radius: 18 // The radius of the inner circle
  			, scale: 1 // Scales overall size of the spinner
  			, corners: 1 // Corner roundness (0..1)
  			, color: '#000' // #rgb or #rrggbb or array of colors
  			, opacity: 0.2 // Opacity of the lines
  			, rotate: 0 // The rotation offset
  			, direction: 1 // 1: clockwise, -1: counterclockwise
  			, speed: 0.9 // Rounds per second
  			, trail: 63 // Afterglow percentage
  			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
  			, zIndex: 2e9 // The z-index (defaults to 2000000000)
  			, className: 'spinner' // The CSS class to assign to the spinner
  			, top: '40%' // Top position relative to parent
  			, left: '50%' // Left position relative to parent
  			, shadow: false // Whether to render a shadow
  			, hwaccel: false // Whether to use hardware acceleration
  			, position: 'absolute' // Element positioning
		  }

		  var month = moment().subtract(1, 'month').month();

      return(
          <div id='row_address'>
    	        <div className="col-lg-3 col-xs-6">
    	          	<BigWidgetBusiness enable={false} field='details_lis' color="bg-green" index={this.state.index}/>
    	        </div>
    	        <div className="col-lg-3 col-xs-6">
    	          <div className="row">
    	            <div id="widget1" className="col-lg-12 col-xs-12">
    	            	<Widget index={this.state.index} field='real' enable={true} value={ this.state.real } text={this.state.strings.RowAddressBusiness.realTitle} icon="" color="bg-green disabled" />
    	            	<Spinner config={opts} stopped={this.state.stoppedWidget1}/>
    	            </div>
    	          </div>
    	          <div className="row">
    	            <div id="widget2" className="col-lg-12 col-xs-12">
    	            	<Widget index={this.state.index} field='simulated' enable={true} value={ this.state.simul } text={this.state.strings.RowAddressBusiness.simulTitle} icon="" color="bg-green disabled" />
    	            	<Spinner config={opts} stopped={this.state.stoppedWidget2}/>
    	            </div>
    	          </div>
    	        </div>
    	        <div id='knob_widget' className="col-lg-6 col-xs-12">
								<ContainerKnobWidget index={this.state.index} producer_id={this.props.producer_id} type='business' enable={true} value1={ this.state.selfAvg.toFixed(0) } value2={ this.state.regAvg.toFixed(0) } label1={this.state.strings.RowAddress.labelKnob} month={month}/> 
    	        	<Spinner config={opts} stopped={this.state.stoppedAvg1 && this.state.stoppedAvg2}/>
    	        </div>
    	    </div>
      );
    }
}

module.exports = RowAddressBusiness;