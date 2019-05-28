import React from 'react';
import {render} from 'react-dom';

import Widget from '../Widget.jsx';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class RowTwoWidgets extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id='row_two_widgets'>
                  <div id="aqua_widget" className="col-lg-6 col-xs-6">
                    <Widget field="real" enable={false} value={this.props.values[0]} text={this.props.texts[0]} icon={this.props.icons[0]} color={this.props.colors[0]} />
                  </div>
                  <div id="green_widget" className="col-lg-6 col-xs-6">
                    <Widget field="simulada" enable={false} value={this.props.values[1]} text={this.props.texts[1]} icon={this.props.icons[1]} color={this.props.colors[1]} />
                  </div> 
            </div>
        );
    }
}

module.exports = RowTwoWidgets;