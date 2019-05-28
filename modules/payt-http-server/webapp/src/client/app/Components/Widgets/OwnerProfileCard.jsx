import React from 'react';
import {render} from 'react-dom';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class OwnerProfileCard extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {strings: getAppState()};
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
        let { name, address, city, zipcode } = this.props.owner;

        return(
            <div>
                <div style={{textAlign: 'center'}}><h3><strong>{this.state.strings.OwnerProfileCard.name}:</strong></h3>{name} </div>
                <div style={{textAlign: 'center'}}><h3><strong>{this.state.strings.OwnerProfileCard.address}:</strong></h3>{address} </div>
                <div style={{textAlign: 'center'}}><h3><strong>{this.state.strings.OwnerProfileCard.city}:</strong></h3>{city} </div>
                <div style={{textAlign: 'center'}}><h3><strong>{this.state.strings.OwnerProfileCard.zipcode}:</strong></h3>{zipcode} </div>
            </div>
        );
    }
}

module.exports = OwnerProfileCard;