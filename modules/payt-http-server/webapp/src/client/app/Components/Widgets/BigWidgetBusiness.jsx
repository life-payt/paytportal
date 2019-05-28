import React from 'react';
import {render} from 'react-dom';

import DetailsBusiness from './DetailsBusiness.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class BigWidgetBusiness extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onUserInfoChange = this._onUserInfoChange.bind(this);
        this.state = {strings:getAppState(), party: getPart()};

        this.addr_list = [];
        var producers = this.state.party.producers;

        for(var i=0; i<producers.length; i++){
          this.addr_list.push(producers[i].address);
        }
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

    showDetails(){
        render(<DetailsBusiness size={3}/>,document.getElementById('list_rows'));
    }

    render() {
        return(
            <div className={'small-box ' + this.props.color}>
              <div className="inner" style={{height:310}}>
                <h3><i className="ion ion-person"></i>   { this.state.party.name }</h3>
                <p><i className="ion ion-android-home"></i>   { this.addr_list[this.props.index] }</p>
                <p><i className="ion ion-ios-location"></i>   { this.addr_list[0] }</p>
                <p><i className="ion ion-pricetag"></i>   { this.state.party.contract }</p>
                <div className="row" style={{textAlign: 'center', paddingTop:20}}>
                  <img src="/public/dist/img/badge-founder.png" style={{height:85, width:85}}></img>
                  <img src="/public/dist/img/badge-verified.png" style={{height:85, width:85}}></img>
                </div>
              </div>
              <div className="icon">
                <i className=""></i>
              </div>
            </div>
        );
    }
}

module.exports = BigWidgetBusiness;