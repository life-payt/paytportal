import React from 'react';
import {render} from 'react-dom';

import {Line} from 'react-chartjs-2';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class BillsChart extends React.Component {
    constructor(props){
      super(props);

      this.state = {
          strings: getAppState()
      };

      this._onChange = this._onChange.bind(this);
    }

    componentDidMount(){
      TranslationsStore.addChangeListener(this._onChange);
    }

    // Unbind change listener
    componentWillUnmount() {
      TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    formatData(){
      let { real_bills, simul_bills } = this.props;

      var real_values = [];
      var simul_values = [];
      var dataLabels = [];
      for(var i=0; i<real_bills.length; i++){
          real_values.push(real_bills[i].value);
          simul_bills[i] ? simul_values.push(simul_bills[i].value) : simul_values.push('n/d');
          dataLabels.push(real_bills[i].period_begin+' - '+real_bills[i].period_end);
      }

      const data = {
        labels: dataLabels,
        datasets: [
          {
            label: this.state.strings.BillsChart.labelReal,
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            borderColor: 'rgba(255,0,0,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(255,0,0,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(255,0,0,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: real_values
          },
          {
            label: this.state.strings.BillsChart.labelSimul,
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: simul_values
          }
        ]
      };

      return data;
    }

    render() {
        var data = this.formatData();

        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.BillsChart.title}</h3>
              </div>
              <div className="box-body">
                <Line data={data} height={this.props.height} options={this.props.options}/>
              </div>
            </div>
        );
    }
}

module.exports = BillsChart;