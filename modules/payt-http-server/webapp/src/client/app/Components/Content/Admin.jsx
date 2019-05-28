import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AdminGeneral from "../AdminContent/AdminGeneral.jsx";
import AdminUsers from "../AdminContent/AdminUsers.jsx";
import AdminServices from "../AdminContent/AdminServices.jsx";
import AdminPolicies from "../AdminContent/AdminPolicies.jsx";
import AdminSettings from "../AdminContent/AdminSettings.jsx";
import ContentHeader from "../Widgets/ContentHeader.jsx";
import Notification from "../Widgets/Notification.jsx";

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var NotificationsStore = require('../Flux/Stores/NotificationsStore');

function getAppState() {
    return TranslationsStore.getStrings();
}

function getNotifications() {
    return NotificationsStore.getNotifications();
}

class AdminContent extends React.Component {
    constructor(props) {
		super(props);

		this.state = {
            strings: getAppState(),
            notifications: getNotifications()
	    };

        this._onChange = this._onChange.bind(this);
        this._onNotificationsChange = this._onChange.bind(this);
    }

    // Listen for changes
	componentDidMount() {
        TranslationsStore.addChangeListener(this._onChange);
        NotificationsStore.addChangeListener(this._onNotificationsChange);
	}

	// Unbind change listener
	componentWillUnmount() {
        TranslationsStore.removeChangeListener(this._onChange);
        NotificationsStore.removeChangeListener(this._onNotificationsChange);
	}

	_onChange() {
		this.setState({strings:getAppState()});
    }

    _onNotificationsChange() {
		this.setState({notifications: getNotifications()});
	}
     
    render() {
		let { match } = this.props; 
        var list = [];
		var notifications = this.state.notifications;

		for(var i=0; i<notifications.length; i++){
			var entry = <li key={i}><Notification index={i} text={notifications[i].text} type={notifications[i].type}/></li>;
			list.push(entry);
		}

		let title = this.props.location.state ? this.props.location.state.title : 'Dashboard';
        
        return (
            <div>
				<ContentHeader title={title} />
				<section id = "list_rows" className="content">
					<Switch>
						<Route path={`/admin/general`} component={AdminGeneral} />
						<Route path={`/admin/users`} component={AdminUsers} />
						<Route path={`/admin/services`} component={AdminServices} />
						<Route path={`/admin/policies`} component={AdminPolicies} />
						<Route path={`/admin/settings`} component={AdminSettings} />
						<Redirect to={`/admin/users`} />
					</Switch>
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

module.exports = AdminContent;