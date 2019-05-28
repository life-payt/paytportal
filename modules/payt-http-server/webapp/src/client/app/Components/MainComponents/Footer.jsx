import React from 'react';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class Footer extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		return(
			<div>
				<div className="pull-right hidden-xs">
			      <b>Version</b> 0.8
			    </div>
					<strong><a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style={{borderWidth:0}} src="https://i.creativecommons.org/l/by/4.0/80x15.png" /></a> This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.</strong>
			</div>
		);
	}
}

module.exports = Footer;