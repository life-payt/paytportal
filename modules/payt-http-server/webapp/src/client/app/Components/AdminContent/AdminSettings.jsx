import React from 'react';
import {render} from 'react-dom';
import EditProfile from '../Widgets/EditProfile.jsx';

class AdminSettings extends React.Component { 
	constructor(props) {
	    super(props);
	}

	render() {
	  	return(
	  		<div className="row">
				<div className="col-lg-8 col-sm-12 col-xs-12"><EditProfile /></div>
	  		</div>
	  	);
	}
}

module.exports = AdminSettings;