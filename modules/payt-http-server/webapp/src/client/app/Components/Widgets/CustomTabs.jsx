import React from 'react';
import {render} from 'react-dom';

import Widget from './Widget.jsx';

import RangePicker from './RangePicker.jsx';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var moment = require('moment');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class CustomTabs extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.setHistAvg = this.setHistAvg.bind(this);

        var strings = getAppState();

        this.state = {
          interval: strings.CustomTabs.defaultInt,
          label: strings.CustomTabs.labelInt,
          strings: strings,
          producer_id: props.producer_id,
          avg: '---',
          hist_avg: '---'
        }

        
        window.payt_session.call('payt.'+window.county+'.db.private.get_producer_day_average', {args: [this.state.producer_id], callback: function (res){
          if(res != null)
            this.setHistAvg(res['TOTAL']);
        }.bind(this),
          exchange: window.county
        });
    }

    setHistAvg(value){
        this.setState({hist_avg:value});
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
      var strings = getAppState();
      this.setState({strings:strings, label:strings.CustomTabs.labelInt, interval: strings.CustomTabs.defaultInt});
    }

    handleEvent (picker) {
        this.setState({
            interval: picker.chosenLabel,
            label: '   '+picker.chosenLabel+'   ',
        });

        var start_date = picker.startDate.startOf('month').utc().toDate();
        var end_date = picker.endDate.endOf('month').subtract(1, 'months').utc().toDate();

        window.payt_session.call('payt.'+window.county+'.db.private.get_producer_day_average', {args: [this.state.producer_id,start_date,end_date], callback: function (res){
          console.log(res); // Finalizar isto
        }.bind(this),
          exchange: window.county
        });
    }

    render() {
        var ranges = {[this.state.strings.CustomTabs.ranges[0]]: [moment().subtract(3, 'months'), moment()],
                      [this.state.strings.CustomTabs.ranges[1]]: [moment().subtract(6, 'months'), moment()],
                      [this.state.strings.CustomTabs.ranges[2]]: [moment().subtract(12, 'months'), moment()]};

        return (
            <div className="nav-tabs-custom tab-success">
                <ul className="nav nav-tabs">
                  <li className="active"><a href="#tab_1-1" data-toggle="tab">{this.state.strings.CustomTabs.tab1}</a></li>
                  <li><a href="#tab_2-2" data-toggle="tab">{this.state.strings.CustomTabs.tab2}</a></li>
                </ul>
                <div className="tab-content">
                  <div className="row">
                    <div className="col-lg-2" style={{marginBottom:20}}>
                      <RangePicker ranges={ranges} onApply={this.handleEvent.bind(this)} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <h3>{this.state.interval}</h3>
                    </div>
                  </div>
                  <div className="tab-pane active" id="tab_1-1">
                    <div className="row">
                      <div className="col-lg-12">
                        <Widget enable={false} field='' value={this.state.avg + this.state.strings.CustomTabs.unit} text={this.state.strings.CustomTabs.currentAvg} icon='' color='bg-green' />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">  
                        <Widget enable={false} field='' value={this.state.hist_avg + this.state.strings.CustomTabs.unit} text={this.state.strings.CustomTabs.historyAvg} icon='' color='bg-green' />
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="tab_2-2">
                    <div className="row">
                      <div className="col-lg-6">
                        <Widget enable={false} field='' value={7 + ' %'} text={this.state.strings.CustomTabs.currentAvg} icon='' color='bg-green' />
                      </div>
                      <div className="col-lg-6">  
                        <Widget enable={false} field='' value={9 + ' %'} text={this.state.strings.CustomTabs.historyAvg} icon='' color='bg-green' />
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        );
    }
}

module.exports = CustomTabs;