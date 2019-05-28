import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router-dom';

import ComparisonsBusiness from '../ComparisonsBusiness.jsx';
import KnobWidget from '../KnobWidget.jsx';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class ContainerKnobWidget extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {strings:getAppState(),producer_id:props.producer_id};
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

    showMore() {
        render(<ComparisonsBusiness producer_id={this.props.producer_id} value1={this.props.value1} value2={this.props.value2} month={this.props.month} />,document.getElementById('list_rows'));
    }

    render() {
        var footer = '';

        if(this.props.enable){
          footer = (  
            <Link to={{ pathname: `/user/address/${this.props.index}/comparison-details`, state: { title: this.state.strings.ContainerKnobWidget.titleMore}}}>
                <div className="box-footer" style={{textAlign:'center', padding: 5, color: 'green'}}>
                    {this.state.strings.ContainerKnobWidget.moreInfo}<i className="fa fa-arrow-circle-right"></i>
                </div> 
            </Link>);
        }

        return(
              <div className="box box-success" style={{minHeight:312,overflow:'hidden'}}>
                <div className="box-body">
                  <div className="row">
                    <h3 style={{ textAlign: 'center' }}> {this.state.strings.ContainerKnobWidget.wasteProduced + this.state.strings.Months[this.props.month]} </h3>
                  </div>
                  <div className="row">
                    <div className="col-xs-12 col-sm-3 col-md-3 text-center">
                      <div className="row" style={{ height:40 }}></div>
                      <div className="row"><h2>{this.props.value2 + ' ' + this.state.strings.ContainerKnobWidget.unit}</h2></div>
                      <div className="row" style={{ height:70 }}></div>
                      <div className="knob-label"><p>{this.state.strings.ContainerKnobWidget.regAvg}</p></div>
                    </div>
                    <div className="col-xs-12 col-sm-5 col-md-5 text-center">
                      <KnobWidget id='1' value={this.props.value1} label={this.props.label1} type={this.props.type}/>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4">
                      <ul style={{ listStyle: 'none', paddingTop: 20}}> 
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#19A903', fontSize: 20 }}></i>{this.state.strings.ContainerKnobWidget.rankBest}</li>
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#71B802', fontSize: 20 }}></i>{this.state.strings.ContainerKnobWidget.rankGood}</li>
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#C7B801', fontSize: 20 }}></i>{this.state.strings.ContainerKnobWidget.rankNormal}</li>
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#D66200', fontSize: 20 }}></i>{this.state.strings.ContainerKnobWidget.rankBad}</li>
                        <li><i className="fa fa-square" aria-hidden="true" style={{ color: '#E50002', fontSize: 20 }}></i>{this.state.strings.ContainerKnobWidget.rankWorst}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {footer}
              </div>
        );
    }
}

module.exports = ContainerKnobWidget;