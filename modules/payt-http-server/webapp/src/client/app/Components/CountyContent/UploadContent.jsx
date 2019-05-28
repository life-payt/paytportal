import React from 'react';
import {render} from 'react-dom';

import DropWidget from '../Widgets/DropWidget.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
import * as NotificationsActions from '../Flux/Actions/NotificationsActions';

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class UploadContent extends React.Component { 
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
	  
	  window.payt_session.on_message = function(msg) {
			switch(msg.state){
				//case "uploading":
				case "processing":
					NotificationsActions.addNotification({text: this.state.strings.UploadContent.notifications[msg.state],type:'warning'});
					break;
				case "processed":
					NotificationsActions.addNotification({text: this.state.strings.UploadContent.notifications[msg.state],type:'success'});
					break;
				case "invalid_format":
					NotificationsActions.addNotification({text: this.state.strings.UploadContent.notifications[msg.state],type:'danger'});
			}
		}.bind(this);
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
	  			<div className="col-lg-6 col-sm-12 col-xs-12">
	  				<DropWidget type='users'/>
	  			</div>
                <div className="col-lg-6 col-sm-12 col-xs-12">
	  				<DropWidget type='bills'/>
	  			</div>
	  		</div>
	  	);
	}
}

module.exports = UploadContent;