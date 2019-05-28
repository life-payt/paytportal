import React from 'react';
import {render} from 'react-dom';

import EditProfile from '../Widgets/EditProfile.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class MunSettings extends React.Component { 
	constructor(props) {
	    super(props);

	    this.state = {
	        strings: getAppState()
	    };

		this._onChange = this._onChange.bind(this);
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
	  		<div className="row">
	  			<div className="col-lg-8 col-sm-12 col-xs-12"><EditProfile /></div>
	  		</div>
	  	);
	}
}

module.exports = MunSettings;