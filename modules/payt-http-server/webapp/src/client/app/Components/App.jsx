import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';
import * as UserInfoActions from './Flux/Actions/UserInfoActions';
import General from './General.jsx';
import PrivateRoute from './Utils/PrivateRoute.jsx';

var UserInfoStore = require('./Flux/Stores/UserInfoStore');

function getUserState() {
	return UserInfoStore.getUserInfo().isAuthenticated;
}

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {loggedIn: null};

        this.connect = this.connect.bind(this);
        this._onUserInfoChange = this._onUserInfoChange.bind(this);

        this.connect();
    }

    componentDidMount() {
		UserInfoStore.addChangeListener(this._onUserInfoChange);
	}

	// Unbind change listener
	componentWillUnmount() {
		UserInfoStore.removeChangeListener(this._onUserInfoChange);
	}

	_onUserInfoChange() {
		this.setState({loggedIn: getUserState()});
	}

    connect(){
        var connect_parameters = {
            host: 'localhost',
            port: 8080,
            vhost: 'payt',
            exchange:'aveiro',
            secure: window.location.hostname == "portal.life-payt.eu"
        };
        
        var temp_user = read_cookie('user_id');
        var temp_token = read_cookie('access_token');
        
        if (temp_token && temp_user){
            connect_parameters.username = temp_user;
            connect_parameters.password = temp_token;
        }
        
        var client = new YAASClient(connect_parameters);

        client.on_connect = function(){
            if (client.is_authenticated()){
                client.subscribe('payt.notifications.'+client._username, "notify");
                console.log('Connected');
                var myCookie = read_cookie("lang");
        
                if (myCookie == null)
                    create_cookie('lang', 'pt', 365);
                
                UserInfoActions.updateAuthenticated(true);
            }
            else{
                UserInfoActions.updateAuthenticated(false);
            }
        }.bind(this);
        
        client.connect();

        window.payt_session = client;
    }
    
    render() {
        setTimeout(function() {
            $.AdminLTE.layout.fix();
            $.AdminLTE.layout.fixSidebar();
        }, 250);

        return (
            this.state.loggedIn != null ?
            (   <Switch>
                    <Route path='/general' component={General} />
                    <PrivateRoute path='/' component={Dashboard} />
                    <Redirect to="/"/>
                </Switch> ) :
            <div></div>
        )
    }
}

function create_cookie(name,value,days) {
	var date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000) + 5000);
	var expires = "; expires=" + date.toGMTString();
	document.cookie = name + "=" + value + expires + "; path=/";
}

function read_cookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') {
					c = c.substring(1,c.length);
			}
			if (c.indexOf(nameEQ) == 0) {
					return c.substring(nameEQ.length,c.length);
			}
	}
	return null;
}

function delete_cookie(name) {
	create_cookie(name,"",-1);
}

module.exports = App;