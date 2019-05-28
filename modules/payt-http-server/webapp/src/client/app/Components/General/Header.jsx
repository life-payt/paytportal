import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');
import * as TranslationsActions from '../Flux/Actions/TranslationsActions';

import en from '../i18n/en';
import pt from '../i18n/pt';
import gr from '../i18n/gr';

const languages = {
    en,
    pt,
    gr
};

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class Header extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {strings: getAppState(), currentLanguage: read_cookie('lang')};
        this.changeLanguage = this.changeLanguage.bind(this);
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

    changeLanguage(e){
        let lang = e.target.value;
        TranslationsActions.loadStrings(languages[lang]);

        console.log('New Language: ' + lang);
        create_cookie('lang',lang,365);
        this.setState({currentLanguage:lang});
    }

    render() {
        return(
            <div id="header" className="main-header" style={{margin: '10px 10px -40px 10px', textAlign: 'right'}}>
                <section>
                    <select className="language" onChange={this.changeLanguage} value={this.state.currentLanguage || 'pt'}>
                        <option value="pt">Português</option>
                        <option value="gr">Ελληνικά</option>
                        <option value="en">English</option>
                    </select>
                </section>
            </div>
        );
    }
}

function create_cookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000) + 300000);
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires + "; path=/";
}

function read_cookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') {
					c = c.substring(1,c.length);
			}
			if (c.indexOf(nameEQ) == 0) {
					return c.substring(nameEQ.length,c.length);
			}
	}
	return null;
}

module.exports = Header;