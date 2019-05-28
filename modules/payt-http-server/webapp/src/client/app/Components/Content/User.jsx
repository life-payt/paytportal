import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import BillDetails from "../UserContent/BillDetails.jsx";
import Bills from "../UserContent/Bills.jsx";
import BusinessContent from "../UserContent/Business.jsx";
import ContainersNormal from "../UserContent/ContainersNormal.jsx";
import NormalContent from "../UserContent/Normal.jsx";
import NormalBusinessSettings from "../UserContent/NormalBusinessSettings.jsx";
import NormalSettings from "../UserContent/NormalSettings.jsx";
import Simulator from "../UserContent/Simulator.jsx";
import TotalNormalBusiness from "../UserContent/TotalNormalBusiness.jsx";
import ComparisonsBusiness from "../Widgets/ComparisonsBusiness.jsx";
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

class UserContent extends React.Component {
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
        
        if(!_.isEmpty(partyAct)){
            switch(window.county){
                case 'lisbon':
                    cswitch =       <Switch>
                                        <Route exact path={`/user/address/:id`} component={BusinessContent} />
                                        <Route path={`/user/address/:id/real-details`} component={BillDetails} />
                                        <Route path={`/user/address/:id/simulated-details`} component={BillDetails} />
                                        <Route path={`/user/address/:id/comparison-details`} component={ComparisonsBusiness} />
                                        <Route path={`/user/total`} component={TotalNormalBusiness} />
                                        <Route path={`/user/simulator`} component={Simulator} />
                                        <Route path={`/user/settings`} component={NormalBusinessSettings} />
                                        <Redirect to={`/user/address/0`} /> {/*Teste*/}
                                    </Switch>;
                    break;
                case 'caoli':
                case 'aveiro':
                    cswitch =       <Switch>
                                        <Route exact path={`/user/address/:id`} component={NormalContent} />
                                        {/*<Route path={`/user/address/:id/real-details`} component={BillDetails} />
                                        <Route path={`/user/address/:id/simulated-details`} component={BillDetails} />
                                        <Route path={`/user/usages`} component={Usages} />*/}
                                        <Route path={`/user/containers`} component={ContainersNormal} />
                                        <Route path={`/user/bills`} component={Bills} />
                                        <Route path={`/user/settings`} component={NormalSettings} />
                                        <Redirect to={`/user/address/0`} /> {/*Teste*/}
                                    </Switch>;
                    break;
            }
        }
        
        let title = this.props.location.state ? this.props.location.state.title : 'Dashboard';

        return (
            <div>
                { this.state.showAlert && window.county == 'aveiro' ? 
                            <section>
                                <Alert bsStyle="warning" onDismiss={this.handleDismiss}>
                                    <h4>Informação</h4>
                                    <p>
                                        Devido ao facto dos contentores ainda não estarem fechados e o novo sistema ainda não estar
                                        a funcionar na sua totalidade poderá ainda não existir dados para consulta!
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

module.exports = UserContent;