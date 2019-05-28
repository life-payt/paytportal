import React from 'react';
import {render} from 'react-dom';

import GMap from '../Widgets/GMap.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class ContainersNormal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
    		party: getParty(),
			strings: getAppState(),
			positions: []
    	};

		this._onChange = this._onChange.bind(this);
		this._onUserInfoChange = this._onUserInfoChange.bind(this); 
		this.setPositions = this.setPositions.bind(this);
		
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
    	var marker = L.icon({
			iconUrl: '/public/dist/img/bin.png',
			iconSize: [20, 30],
			iconAnchor: [22, 30],
			popupAnchor: [-12, -32],
	  	});

	  	var marker_name = this.state.strings.ContainersNormal.markerName;

		return (
			<div>
				<div className="row">
					<section className="col-lg-12">
						<GMap height={595} zoom={17} type='container' positions={this.state.positions} marker={marker} marker_name={marker_name} title={this.state.strings.ContainersNormal.gmapTitle} enable={false}/>
					</section>
				</div>
			</div>
		);
	}
}

module.exports = ContainersNormal;