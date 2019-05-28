import React from 'react';
import LanguageSelector from '../Widgets/LanguageSelector.jsx';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');
import * as UserInfoActions from '../Flux/Actions/UserInfoActions';

// Method to retrieve application state from store
function getAppState() {
	return TranslationsStore.getStrings();
}

function create_cookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else {
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function delete_cookie(name) {
	create_cookie(name, "", -1);
}

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			strings: getAppState()
		};

		this._onChange = this._onChange.bind(this);

		this.logout.bind(this);
	}

	// Listen for changes
	componentDidMount() {
		TranslationsStore.addChangeListener(this._onChange);
	}

	// Unbind change listener
	componentWillUnmount() {
		TranslationsStore.removeChangeListener(this._onChange);
	}

	_onChange() {
		this.setState({ strings: getAppState() });
	}

	logout() {
		delete_cookie('user_id');
		delete_cookie('access_token');
		window.payt_session.connect({ username: 'anonymous', password: 'anonymous' });
		window.location.replace('/');
		UserInfoActions.updateAuthenticated(false);
	}

	render() {
		return (
			<div>
				<header className="main-header">
					<a href="/" className="logo">

						<span className="logo-mini"><b>L</b>P</span>

						<span className="logo-lg"><b>LIFE</b>PAYT</span>
					</a>

					<nav className="navbar navbar-static-top">

						<a style={{ cursor: 'pointer' }} className="sidebar-toggle" data-toggle="offcanvas" role="button">
							<span className="sr-only">Toggle navigation</span>
						</a>

						<div id="nav-bar" className="navbar-custom-menu">
							<ul className="nav navbar-nav">
								<LanguageSelector />
								<li>
									<a style={{ cursor: 'pointer' }} onClick={this.logout.bind(this)}>{this.state.strings.Header.signOut}</a>
								</li>
							</ul>
						</div>
					</nav>
				</header>
			</div>
		);
	}
}

module.exports = Header;