import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class Footer extends React.Component {
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
            <footer id="footer" className="footer">
                <h3>{this.state.strings.General.Footer.partners}</h3>
                <div id="logo-container">
                    <ul id="list-logos">
                        <li>
                            <a href="http://www.cm-aveiro.pt/"><img src="/public/dist/img/logos/cm-aveiro.png" /></a>
                        </li>
                        <li>
                            <a href="http://www.cm-condeixa.pt/"><img src="/public/dist/img/logos/cm-condeixa.png" /></a>
                        </li>
                        <li>
                            <a href="http://www.cm-lisboa.pt/"><img src="/public/dist/img/logos/cm-lisboa.png" /></a>
                        </li>
                        <li>
                            <a href="http://www.larnaka.org.cy/"><img src="/public/dist/img/logos/cm-larnaka.jpg" /></a>
                        </li>
                        <li>
                            <a href="http://www.vrilissia.gr/"><img src="/public/dist/img/logos/cm-vrlissia.jpg" /></a>
                        </li>
                        <li>
                            <a href="https://www.ipc.pt/"><img src="/public/dist/img/logos/ipc.png" /></a>
                        </li>
                        <li>
                            <a href="http://www.ntua.gr/"><img src="/public/dist/img/logos/emp.png" /></a>
                        </li>
                        <li>
                            <a href="http://www.deti.ua.pt/"><img src="/public/dist/img/logos/ua.png" /></a>
                        </li>
                    </ul>
                </div>
            </footer>
        );
    }
}

module.exports = Footer;