import React from 'react';
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

function create_cookie(name,value,days) {
	var date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000) + 5000);
	var expires = "; expires=" + date.toGMTString();
	document.cookie = name + "=" + value + expires + "; path=/";
}

class LanguageSelector extends React.Component {
    constructor(props){
        super(props);

        this.state={
            currentLanguage:getCookie('lang')
        }

        this.changeLanguage.bind(this);
    }

    changeLanguage(lang){
        TranslationsActions.loadStrings(languages[lang]);

        console.log('New Language: ' + lang);
        create_cookie('lang',lang,365);
        this.setState({currentLanguage:lang});
    }

    langNotAvailable(){
        alert("This language isn't availble yet");
    }

    render() {
        return (
            <li id="lang-select" className="dropdown"> 
              <a style={{cursor: 'pointer'}} className="dropdown-toggle" data-toggle="dropdown" data-close-others="true">
                <img src={"/public/dist/img/flag-"+this.state.currentLanguage+"_alt.png"} />
              </a>
              <ul className="dropdown-menu pull-right">
                <li>
                  <a style={{cursor: 'pointer'}} onClick={this.changeLanguage.bind(this,'pt')}>
                    <img src="/public/dist/img/flag-pt_alt.png" />
                    <span>Português</span>
                  </a>
                </li>
                <li>
                  <a style={{cursor: 'pointer'}} onClick={this.changeLanguage.bind(this,'gr')}>
                    <img src="/public/dist/img/flag-gr_alt.png" />
                    <span>Ελληνικά</span>
                  </a>
                </li>
                <li>
                  <a style={{cursor: 'pointer'}} onClick={this.changeLanguage.bind(this,'en')}>
                    <img src="/public/dist/img/flag-en_alt.png" />
                    <span>English</span>
                  </a>
                </li>
              </ul>
            </li>
        );
    }
}

function getCookie(name) {
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

module.exports = LanguageSelector;