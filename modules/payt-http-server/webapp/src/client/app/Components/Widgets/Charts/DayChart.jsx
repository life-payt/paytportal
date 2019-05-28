import React from 'react';
import {render} from 'react-dom';

import {Line,Bar} from 'react-chartjs-2';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class DayChart extends React.Component {
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

    formatData(values){
      var dataValues = [];
      var dataLabels = [];
      for(var i=0; i<values.length; i++){
          dataValues.push(values[i].value);
          dataLabels.push(values[i].day+'/'+(values[i].month+1)+'/'+values[i].year);
      }

      const data = {
        labels: dataLabels,
        datasets: [
          {
            label: this.state.strings.DayChart.label,
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
        ]
      };

      return data;
    }

    render() {
        var data = this.formatData(this.props.values);

        var unit = this.props.unit || ' €';
        var yLabel = this.props.yLabel;

        const options = { 
            scales: {
              xAxes: [{
                ticks: {
                  fontSize: 10
                }
              }],
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: yLabel
                }
              }]
            },
          tooltips: {
            mode: 'x',
            callbacks: {
                label: function(tooltipItem, data) {
                    return new String(tooltipItem.yLabel).replace(".",",") + unit;
                }
            }
          },
          maintainAspectRatio: false,
          responsive:true
        };

        return(
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">{this.props.text}</h3>
              </div>
              <div className="box-body">
                <Line data={data} height={400} options={options}/>
              </div>
            </div>
        );
    }
}

module.exports = DayChart;