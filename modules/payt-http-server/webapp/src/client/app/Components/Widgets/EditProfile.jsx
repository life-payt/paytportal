import React from 'react';
import {render} from 'react-dom';

import ChangePassword from './Forms/ChangePassword.jsx';
import ChangeInfo from './Forms/ChangeInfo.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class EditProfile extends React.Component { 
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
            <div className="box box-success">
                <div className="box-header with-border">
                    <h3 className="box-title">{this.state.strings.EditProfile.title}</h3>
                </div>
                <div className="box-body">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                            <ChangeInfo />
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                            <ChangePassword />
                        </div>
                    </div>
                </div>
            </div>
	  	);
	}
}

module.exports = EditProfile;