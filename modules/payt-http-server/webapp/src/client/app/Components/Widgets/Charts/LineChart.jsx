import React from 'react';
import {render} from 'react-dom';

import {Line} from 'react-chartjs-2';
var moment = require('moment');

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class LineChart extends React.Component {
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
      var values1 = [{
              id: 1,
              month: moment().subtract(6, 'month').format('M'),
              year: moment().subtract(6, 'month').format('YYYY'),
              value: this.props.totalRealMonths[0]
          },{
              id: 2,
              month: moment().subtract(5, 'month').format('M'),
              year: moment().subtract(5, 'month').format('YYYY'),
              value: this.props.totalRealMonths[1]
          },{
              id: 3,
              month: moment().subtract(4, 'month').format('M'),
              year: moment().subtract(4, 'month').format('YYYY'),
              value: this.props.totalRealMonths[2]
          },{
              id: 4,
              month: moment().subtract(3, 'month').format('M'),
              year: moment().subtract(3, 'month').format('YYYY'),
              value: this.props.totalRealMonths[3]
          },{
              id: 5,
              month: moment().subtract(2, 'month').format('M'),
              year: moment().subtract(2, 'month').format('YYYY'),
              value: this.props.totalRealMonths[4]
          },{
              id: 6,
              month: moment().subtract(1, 'month').format('M'),
              year: moment().subtract(1, 'month').format('YYYY'),
              value: this.props.totalRealMonths[5]
          }];
      var values2 = [{
              id: 1,
              month: moment().subtract(6, 'month').format('M'),
              year: moment().subtract(6, 'month').format('YYYY'),
              value: this.props.totalSimulMonths[0]
          },{
              id: 2,
              month: moment().subtract(5, 'month').format('M'),
              year: moment().subtract(5, 'month').format('YYYY'),
              value: this.props.totalSimulMonths[1]
          },{
              id: 3,
              month: moment().subtract(4, 'month').format('M'),
              year: moment().subtract(4, 'month').format('YYYY'),
              value: this.props.totalSimulMonths[2]
          },{
              id: 4,
              month: moment().subtract(3, 'month').format('M'),
              year: moment().subtract(3, 'month').format('YYYY'),
              value: this.props.totalSimulMonths[3]
          },{
              id: 5,
              month: moment().subtract(2, 'month').format('M'),
              year: moment().subtract(2, 'month').format('YYYY'),
              value: this.props.totalSimulMonths[4]
          },{
              id: 6,
              month: moment().subtract(1, 'month').format('M'),
              year: moment().subtract(1, 'month').format('YYYY'),
              value: this.props.totalSimulMonths[5]
          }];

      var dataValues = [];
      var dataValues2 = [];
      var dataLabels = [];
      for(var i=0; i<values1.length; i++){
          dataValues.push(values1[i].value);
          dataValues2.push(values2[i].value);
          dataLabels.push(this.state.strings.Months[values1[i].month-1]+' '+values1[i].year);
      }

      const data = {
        labels: dataLabels,
        datasets: [
          {
            label: this.state.strings.LineChart.labelReal,
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
            data: dataValues
          },
          {
            label: this.state.strings.LineChart.labelSimul,
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
            data: dataValues2
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
                <h3 className="box-title">{this.props.text}</h3>
              </div>
              <div className="box-body">
                <Line data={data} height={this.props.height} options={this.props.options}/>
              </div>
            </div>
        );
    }
}

module.exports = LineChart;