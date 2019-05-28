import React from 'react';
import {render} from 'react-dom';

import StatTile from './StatTile.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class DetailsBusiness extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {strings:getAppState()};
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
      this.setState({strings:getAppState()});
    }

    render() {
      var size = this.props.size;
      var stats = []

      for(var i=0; i<8; i++){
          stats[i] = (Math.random() * (20 - 5) + 5).toFixed(0)
      }

      var children1 = <div><h4>{this.state.strings.DetailsBusiness.totalContainers + ' 7'} </h4><h4>{this.state.strings.DetailsBusiness.lastPick + ' 12/01/2017'} </h4></div>;
      var children2 = <div><h4>{this.state.strings.DetailsBusiness.totalContainers + ' 12'} </h4><h4>{this.state.strings.DetailsBusiness.lastPick + ' 20/01/2017'} </h4></div>;
      var children3 = <div><h4>{this.state.strings.DetailsBusiness.totalContainers + ' 9'} </h4><h4>{this.state.strings.DetailsBusiness.lastPick + ' 15/01/2017'} </h4></div>;
      var children4 = <div><h4>{this.state.strings.DetailsBusiness.totalContainers + ' 11'} </h4><h4>{this.state.strings.DetailsBusiness.lastPick + ' 26/01/2017'} </h4></div>;

      var content = (
          <div className="row" id='rowStats'>
              <StatTile width = {size} theme = 'bg-gray-active' icon = 'flaticon-can' subject = {children1} stats = {this.state.strings.DetailsBusiness.indif} link = '' />
              <StatTile width = {size} theme = 'bg-yellow' icon = 'flaticon-can' subject = {children2} stats = {this.state.strings.DetailsBusiness.plast} link = '' />
              <StatTile width = {size} theme = 'bg-green' icon = 'flaticon-can' subject = {children3} stats = {this.state.strings.DetailsBusiness.glass} link = '' />
              <StatTile width = {size} theme = 'bg-blue' icon = 'flaticon-can' subject = {children4} stats = {this.state.strings.DetailsBusiness.pap_cart} link = '' />
          </div>
      );

      return content;
    }
}

module.exports = DetailsBusiness;