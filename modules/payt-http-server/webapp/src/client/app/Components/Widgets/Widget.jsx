import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router-dom';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class Widget extends React.Component {
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
        var btn = '';

        if(this.props.enable){
          if(this.props.type=="personal"){
            btn = ( 
              <Link to={{ pathname: `/county/gstats/${this.props.field}-details`, state: { title: this.state.strings.Widget.title[this.props.field], type: this.props.field }}}>
                  <div className="small-box-footer">{this.state.strings.Widget.moreInfo}<i className="fa fa-arrow-circle-right"></i></div>
              </Link> );
          }
          else{
            btn = ( 
              <Link to={{ pathname: `/user/bills`, state: { title: this.state.strings.Widget.title.bills }}}>
                  <div className="small-box-footer">{this.state.strings.Widget.moreInfo}<i className="fa fa-arrow-circle-right"></i></div>
              </Link> );
          }
        }

        return(
            <div className={this.props.color + ' small-box'}>
                <div className="inner" style={{minHeight:120}}>
                  <h3>{ this.props.value }</h3>

                  <p>{ this.props.text }</p>
                </div>
                <div className="icon">
                  <i className={this.props.icon}></i>
                </div>
                {btn}
            </div>
        );
    }
}

module.exports = Widget;