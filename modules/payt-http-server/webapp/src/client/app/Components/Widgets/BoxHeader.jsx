import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class BoxHeader extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            strings: getAppState()
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount(){
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
        return (
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.BoxHeader.prefixTitle + this.props.index + this.state.strings.BoxHeader.suffixTitle}</h3>
              </div>
            </div>
        );
    }
}

module.exports = BoxHeader;