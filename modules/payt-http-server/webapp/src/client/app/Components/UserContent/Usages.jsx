import React from 'react';
import {render} from 'react-dom';

import UsagesTable from '../Widgets/Tables/UsagesTable.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class Usages extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
	        party: getParty(),
	        strings: getAppState()
	    };

		this._onChange = this._onChange.bind(this);
		this._onUserInfoChange = this._onUserInfoChange.bind(this);

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
        
        return(
            <div>
                <UsagesTable />
            </div>
        )
	}
}

module.exports = Usages;