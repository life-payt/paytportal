import React from 'react';
import { Redirect } from 'react-router-dom';
import AdminContent from '../Content/Admin.jsx';
import CountyContent from '../Content/County.jsx';
import UserContent from '../Content/User.jsx';
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

function getUserState() {
	return UserInfoStore.getUserInfo();
}

class Main extends React.Component {
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
        let { match } = this.props;
        
        switch(this.state.user.role){
            case 'admin':
                return <AdminContent {... this.props}/>;
            case 'county':
                return <CountyContent {... this.props}/>;
            case 'user':
                return <UserContent {... this.props}/>;
        }

        return null;
    }
}

module.exports = Main;