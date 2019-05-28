import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router-dom';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

// Method to retrieve user state from store
function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class NormalSideBar extends React.Component { 
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
        
        var lis = [];

        if(this.state.party.producers.length > 1){
          for (var i=1; i<this.state.party.producers.length; i++) {
              lis.push(<li key={i} className={ this.props.location.pathname.includes(`/user/address/${i}`) ? 'active' : '' }>
                        <Link to={{ pathname: `/user/address/${i}`, state: { title: this.state.party.producers[i].alias }}}>
                            <i className="fa fa-home"></i> <span>{this.state.party.producers[i].alias}</span>
                        </Link>
                      </li>);
          }
        }

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
                  <li className="header">{this.state.strings.NormalSideBar.mainMenu}</li>
                  <li className={ this.props.location.pathname.includes("/user/address/0") ? 'active' : '' }>
                    <Link to={{ pathname: '/user/address/0', state: { title: this.state.party.producers[0].alias }}}>
                      <i className="fa fa-home"></i> <span>{this.state.party.producers[0].alias}</span>
                    </Link>
                  </li>

                  {lis}

                  <li className={ this.props.location.pathname.includes("/user/bills") ? 'active' : '' }>
                    <Link to={{ pathname: '/user/bills', state: { title: this.state.strings.NormalSideBar.bills }}}>
                      <i className="fa fa-dollar-sign"></i> <span>{this.state.strings.NormalSideBar.bills}</span>
                    </Link>
                  </li>
                  <li className={ this.props.location.pathname.includes("/user/containers") ? 'active' : '' }>
                    <Link to={{ pathname: '/user/containers', state: { title: this.state.strings.NormalSideBar.containers }}}>
                      <i className="fa fa-trash"></i> <span>{this.state.strings.NormalSideBar.containers}</span>
                    </Link>
                  </li>
                  {/*}
                  <li className={ this.props.location.pathname.includes("/user/usages") ? 'active' : '' }>
                    <Link to={{ pathname: '/user/usages', state: { title: this.state.strings.NormalSideBar.usages }}}>
                      <i className="fa fa-trash-alt"></i> <span>{this.state.strings.NormalSideBar.usages}</span>
                    </Link>
                  </li>
                  */}
                  <li className={ this.props.location.pathname.includes("/user/settings") ? 'active' : '' }>
                    <Link to={{ pathname: '/user/settings', state: { title: this.state.strings.NormalSideBar.settings }}}>
                      <i className="ion ion-gear-a"></i> <span>{this.state.strings.NormalSideBar.settings}</span>
                    </Link>
                  </li>
                  <li>
                    <a href='https://manual.life-payt.eu/pt'>
                      <i className="fa fa-question-circle"></i> <span>{this.state.strings.NormalSideBar.help}</span>
                    </a>
                  </li>
                </ul>
              </section>
          </aside>
        );
    }
}

module.exports = NormalSideBar;