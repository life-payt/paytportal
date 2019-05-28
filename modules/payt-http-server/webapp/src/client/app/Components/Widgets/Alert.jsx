import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class Alert extends React.Component {
    constructor(props){
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
        return(
            <div className={'alert ' + this.props.alert_color}>
                <h4><i className={'icon ' + this.props.icon}></i> {this.state.strings.Alert.title}</h4>
                {this.props.text}
            </div>
        );
    }
}

module.exports = Alert;