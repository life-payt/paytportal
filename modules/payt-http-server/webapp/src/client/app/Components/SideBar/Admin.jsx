import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router-dom';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class AdminSideBar extends React.Component { 
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
      return (
        <aside className="main-sidebar">   
            <section className="sidebar">
              
              <div className="user-panel">
                <div className="pull-left image">
                  <img src="/public/dist/img/logo.png" className="img-circle" alt="User Image"></img>
                </div>
                <div className="pull-left info">
                  <p> {this.props.name}</p>
                  <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                </div>
              </div>
              
              <ul className="sidebar-menu">
                <li className="header">{this.state.strings.AdminSideBar.mainMenu}</li>
                {/*<li className={ this.props.location.pathname.includes("/admin/general") ? 'active' : '' }>
                  <Link to={{ pathname: '/admin/general', state: { title: this.state.strings.AdminSideBar.general }}}>
                    <i className="fa fa-lock"></i> <span>{this.state.strings.AdminSideBar.general}</span>
                  </Link>
                </li>*/}
                <li className={ this.props.location.pathname.includes("/admin/users") ? 'active' : '' }>
                  <Link to={{ pathname: '/admin/users', state: { title: this.state.strings.AdminSideBar.userManagement }}}>
                    <i className="fa fa-user"></i> <span>{this.state.strings.AdminSideBar.userManagement}</span>
                  </Link>
                </li>
                <li className={ this.props.location.pathname.includes("/admin/services") ? 'active' : '' }>
                  <Link to={{ pathname: '/admin/services', state: { title: this.state.strings.AdminSideBar.services }}}>
                    <i className="fa fa-wrench"></i> <span>{this.state.strings.AdminSideBar.services}</span>
                  </Link>
                </li>
                <li className={ this.props.location.pathname.includes("/admin/policies") ? 'active' : '' }>
                  <Link to={{ pathname: '/admin/policies', state: { title: this.state.strings.AdminSideBar.policies }}}>
                    <i className="fa fa-lock"></i> <span>{this.state.strings.AdminSideBar.policies}</span>
                  </Link>
                </li>
                <li className={ this.props.location.pathname.includes("/admin/settings") ? 'active' : '' }>
                  <Link to={{ pathname: '/admin/settings', state: { title: this.state.strings.AdminSideBar.settings }}}>
                    <i className="fa fa-cogs"></i> <span>{this.state.strings.AdminSideBar.settings}</span>
                  </Link>
                </li>
                <li>
                  <a href='https://manual.life-payt.eu/pt'>
                    <i className="fa fa-question-circle"></i> <span>{this.state.strings.AdminSideBar.help}</span>
                  </a>
                </li>
              </ul>
            </section>
        </aside>
      );
  }
}

module.exports = AdminSideBar;