import React from 'react';
import {render} from 'react-dom';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import CountyBusiness from "../CountyContent/CountyBusiness.jsx";
import ContainersContent from "../CountyContent/ContainersContent.jsx";
import Users from "../CountyContent/Users.jsx";
import Cards from "../CountyContent/Cards.jsx";
import UploadContent from "../CountyContent/UploadContent.jsx";
import MunBusinessSettings from "../CountyContent/MunBusinessSettings.jsx";
import CountyNormal from "../CountyContent/CountyNormal.jsx";
import Producers from "../CountyContent/Producers.jsx";
import MunSettings from "../CountyContent/MunSettings.jsx";
import PrefDetails from "../CountyContent/PrefDetails.jsx";
import ContentHeader from "../Widgets/ContentHeader.jsx";
import Notification from "../Widgets/Notification.jsx";

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var NotificationsStore = require('../Flux/Stores/NotificationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

function getUserState() {
	return UserInfoStore.getUserInfo();
}

function getAppState() {
    return TranslationsStore.getStrings();
}

function getNotifications() {
    return NotificationsStore.getNotifications();
}

class CountyContent extends React.Component {
    constructor(props) {
		super(props);

		this.state = {
            strings: getAppState(),
            notifications: getNotifications(),
            user: getUserState(),
            showAlert: true
	    };

        this._onChange = this._onChange.bind(this);
        this._onNotificationsChange = this._onChange.bind(this);
        this._onUserInfoChange = this._onUserInfoChange.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
    }

    // Listen for changes
	componentDidMount() {
        TranslationsStore.addChangeListener(this._onChange);
        NotificationsStore.addChangeListener(this._onNotificationsChange);
        UserInfoStore.addChangeListener(this._onUserInfoChange);
	}

	// Unbind change listener
	componentWillUnmount() {
        TranslationsStore.removeChangeListener(this._onChange);
        NotificationsStore.removeChangeListener(this._onNotificationsChange);
        UserInfoStore.removeChangeListener(this._onUserInfoChange);
	}

	_onChange() {
		this.setState({strings:getAppState()});
    }

    _onNotificationsChange() {
		this.setState({notifications: getNotifications()});
    }
    
    _onUserInfoChange() {
		this.setState({loggedIn: getUserState()});
    }
    
    handleDismiss() {
        this.setState({ showAlert: false });
    }
     
    render() {
        let { partyAct } = this.state.user;
		let { match } = this.props; 
        var list = [];
		var notifications = this.state.notifications;

		for(var i=0; i<notifications.length; i++){
			var entry = <li key={i}><Notification index={i} text={notifications[i].text} type={notifications[i].type}/></li>;
			list.push(entry);
        }
        
        let cswitch = null;
        
        switch(partyAct.type){
            case 'business':
                cswitch =       <Switch>
                                    <Route exact path={`/county/gstats`} component={CountyBusiness} />
                                    <Route exact path={`/county/producers`} component={Producers} />
                                    <Route exact path={`/county/upload`} component={UploadContent} />
                                    <Route exact path={`/county/settings`} component={MunBusinessSettings} />
                                    <Redirect to={`/county/gstats`} />
                                </Switch>;
                break;
            case 'personal':
                cswitch =       <Switch>
                                    <Route exact path={`/county/gstats`} component={CountyNormal} />
                                    <Route exact path={`/county/containers`} component={ContainersContent} />
                                    <Route exact path={`/county/users`} component={Users} />
                                    <Route exact path={`/county/cards`} component={Cards} />
                                    <Route exact path={`/county/upload`} component={UploadContent} />
                                    <Route exact path={`/county/settings`} component={MunSettings} />
                                    <Route exact path={`/county/gstats/hour-details`} component={PrefDetails} />
                                    <Route exact path={`/county/gstats/day-details`} component={PrefDetails} />
                                    <Route exact path={`/county/gstats/week-details`} component={PrefDetails} />
                                    <Route exact path={`/county/gstats/month-details`} component={PrefDetails} />
                                    <Redirect to={`/county/gstats`} />
                                </Switch>;
                break;
        }

        let title = this.props.location.state ? this.props.location.state.title : 'Dashboard';
        
        return (
            <div>
                { this.state.showAlert && this.state.user.partyAct.type == 'personal' ? 
                            <section>
                                <Alert bsStyle="warning" onDismiss={this.handleDismiss}>
                                    <h4>Informação</h4>
                                    <p>
                                        Devido ao facto dos contentores ainda não estarem fechados e o novo sistema ainda não estar
                                        a funcionar na sua totalidade poderão ainda não existir dados para consulta!
                                    </p>
                                </Alert>
                            </section>
                            : null}
				<ContentHeader title={title} />
				<section id = "list_rows" className="content">
                    {cswitch}
			    </section>
			    <section id = "modalContainer"></section>
			    <section id = "notifications" className="notification-list">
			    	<ul className="list-unstyled">
			    		{list}
			    	</ul>
			    </section>
			</div>
        )
    }
}

module.exports = CountyContent;