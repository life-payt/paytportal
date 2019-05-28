import React from 'react';

import NormalSideBar from '../SideBar/Normal.jsx';
import NormalBusinessSideBar from '../SideBar/NormalBusiness.jsx';
import MunSideBar from '../SideBar/Mun.jsx';
import MunBusinessSideBar from '../SideBar/MunBusiness.jsx';
import AdminSideBar from '../SideBar/Admin.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

// Method to retrieve user state from store
function getUserState() {
	return UserInfoStore.getUserInfo();
}

class SideBar extends React.Component {
	constructor(props) {
		super(props);
		this._onUserInfoChange = this._onUserInfoChange.bind(this);   

		this.state = {
			user: getUserState(),
		};
	}

	// Listen for changes
  	componentDidMount() {
		UserInfoStore.addChangeListener(this._onUserInfoChange);
	}

	// Unbind change listener
	componentWillUnmount() {
		UserInfoStore.removeChangeListener(this._onUserInfoChange);
	}
	
	_onUserInfoChange() {
		this.setState({user: getUserState()});
	}

	render() {
		var sidebar = null;

		if(this.state.user.role == 'user'){
			if(window.county == 'caoli' || window.county == 'aveiro')
				sidebar = <NormalSideBar name={this.state.user.name} {... this.props}/>;
			else if(window.county == 'lisbon')
				sidebar = <NormalBusinessSideBar  name={this.state.user.name} {... this.props}/>;
		}
		else if(this.state.user.role == 'county'){
			if(window.county == 'caoli' || window.county == 'aveiro')
				sidebar = <MunSideBar name={this.state.user.name} {... this.props}/>;
			else if(window.county == 'lisbon')
				sidebar = <MunBusinessSideBar name={this.state.user.name} {... this.props}/>;
		}			
		else if(this.state.user.role == 'admin')
			sidebar = <AdminSideBar name={this.state.user.name} {... this.props}/>;
		
		return(
			<div>
				{sidebar}
			</div>
		);
	}
}

module.exports = SideBar;