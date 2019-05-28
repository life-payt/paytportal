import React from 'react';
import {render} from 'react-dom';

import KnobWidget from './KnobWidget.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class SelfComparisons extends React.Component{
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
          <div className="col-lg-12 col-md-12">
            <div className="box box-success" style={{height:300}}>
              <div className="box-body">
                <div className="row">
                <h3 style={{ textAlign: 'center' }}> {this.state.strings.SelfComparisons.title + this.state.strings.Months[this.props.month]} </h3>
                </div>
                <div className="row">
                  <div className="col-xs-3 col-md-3 text-center">
                    <div className="row" style={{ height:20 }}></div>
                    <div className="row"><h2>{this.props.value2 + this.state.strings.SelfComparisons.unit}</h2></div>
                    <div className="row" style={{ height:40 }}></div>
                    <div className="knob-label"><p>{this.state.strings.SelfComparisons.regAvg}</p></div>
                  </div>
                  <div className="col-xs-3 col-md-3 text-center">
                    <div className="row" style={{ height:20 }}></div>
                    <div className="row"><h2>{this.props.value2 + this.state.strings.SelfComparisons.unit}</h2></div>
                    <div className="row" style={{ height:40 }}></div>
                    <div className="knob-label"><p>{this.state.strings.SelfComparisons.actAvg}</p></div>
                  </div>
                  <div className="col-xs-3 col-md-3 text-center">
                    <KnobWidget id='1' value={this.props.value1} label={this.state.strings.SelfComparisons.selfAvgLabel} />
                  </div>
                  <div className="col-xs-3 col-md-3">
                    <div>
                      <ul style={{ listStyle: 'none', paddingTop: 35}}> 
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#19A903', fontSize: 20 }}></i>{this.state.strings.SelfComparisons.rankBest}</li>
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#71B802', fontSize: 20 }}></i>{this.state.strings.SelfComparisons.rankGood}</li>
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#C7B801', fontSize: 20 }}></i>{this.state.strings.SelfComparisons.rankNormal}</li>
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#D66200', fontSize: 20 }}></i>{this.state.strings.SelfComparisons.rankBad}</li>
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#E50002', fontSize: 20 }}></i>{this.state.strings.SelfComparisons.rankWorst}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

module.exports = SelfComparisons;