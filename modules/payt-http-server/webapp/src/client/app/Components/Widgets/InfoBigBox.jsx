import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class InfoBigBox extends React.Component {
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
            <div className="info-box">
              <span className="info-box-icon bg-yellow"><i className="fa fa-sort"></i></span>

              <div className="info-box-content">
                <span className="info-box-text" style={{fontSize: 13}}>{this.state.strings.InfoBigBox.mostCommon}</span>
                <span className="info-box-number" style={{fontSize: 15}}>1. Contentor X</span>
                <span className="info-box-number" style={{fontSize: 15}}>2. Contentor Y</span>
                <span className="info-box-number" style={{fontSize: 15}}>3. Contentor Z</span>
              </div>
            </div>
        );
    }
}

module.exports = InfoBigBox;