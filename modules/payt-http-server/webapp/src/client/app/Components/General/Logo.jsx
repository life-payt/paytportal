import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class Logo extends React.Component {
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
            <section id="logo-content">
                <div id="logo">
                    <a href="http://www.life-payt.eu/"><img src="/public/dist/img/logos/life-payt.png" /></a>
                </div>
                <div id="btn-container">
                    <button name='btnLogin' className="general-btn general-btn-2 general-btn-2a" onClick={this.props.openLogin} data-toggle="modal" data-target="#myModal"><i className="fas fa-sign-in-alt"></i> {this.state.strings.General.Logo.signin} </button>
                </div>
            </section>
        );
    }
}

module.exports = Logo;