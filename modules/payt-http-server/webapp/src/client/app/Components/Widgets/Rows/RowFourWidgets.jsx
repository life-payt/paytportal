import React from 'react';
import {render} from 'react-dom';

import Widget from '../Widget.jsx';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class RowFourWidgets extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        let type = this.props.type != null ? this.props.type : "";

        return(
            <div id='row_widgets'>
                  <div id="widget1" className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                    <Widget type={type} enable={this.props.enable} field={this.props.details1} value={this.props.values[0]} text={this.props.texts[0]} icon={this.props.icons[0]} color={this.props.colors[0]} />
                  </div>
                  <div id="widget2" className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                    <Widget type={type} enable={this.props.enable} field={this.props.details2} value={this.props.values[1]} text={this.props.texts[1]} icon={this.props.icons[1]} color={this.props.colors[1]} />
                  </div>
                  <div id="widget3" className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                    <Widget type={type} enable={this.props.enable} field={this.props.details3} value={this.props.values[2]} text={this.props.texts[2]} icon={this.props.icons[2]} color={this.props.colors[2]} />
                  </div>
                  <div id="widget4" className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                    <Widget type={type} enable={this.props.enable} field={this.props.details4} value={this.props.values[3]} text={this.props.texts[3]} icon={this.props.icons[3]} color={this.props.colors[3]} />
                  </div>
            </div> 
        );
    }
}

module.exports = RowFourWidgets;