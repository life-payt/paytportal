import React from 'react';
import {render} from 'react-dom';

import ComparisonsBusiness from '../ComparisonsBusiness.jsx';
import {Line,Bar} from 'react-chartjs-2';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class ContainerLineChart extends React.Component {
    constructor(props){
      super(props);
      this._onChange = this._onChange.bind(this);
      this.state = {
        strings: getAppState(),
        nMonths: 6,
        usage_months: {}
      };

      this.fetchContainerUsage();
    }

    // Listen for changes
    componentDidMount() {
      TranslationsStore.addChangeListener(this._onChange);
    }

    componentDidUpdate(prevProps, prevState){
      if(prevProps.id != this.props.id)
        this.fetchContainerUsage();
    }

    // Unbind change listener
    componentWillUnmount() {
      TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    fetchContainerUsage(){
      window.payt_session.call('payt.'+window.county+'.db.private.get_container_usage_month', {
        args: [this.props.id, this.state.nMonths],
        callback: function (res){
          var tmp =[];
          Object.keys(res).forEach(date => {
              let month = parseInt(date.split('-')[1])-1;
              let year = date.split('-')[0]; 
              tmp.push({ 
                  month: this.state.strings.Months[month],
                  year: year,
                  value: res[date]
              })
          });

          var dataValues = [];
          var dataLabels = [];
          for(var i=0; i<tmp.length; i++){
              dataValues.push(tmp[i].value);
              dataLabels.push(tmp[i].month+' '+tmp[i].year);
          }

          const data = {
            labels: dataLabels,
            datasets: [
              {
                label: this.state.strings.ContainerLineChart.label,
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
              }
            ]
          };
          this.setState({usage_months: data});
        }.bind(this),
        exchange: window.county
      });
    }

    render() {
        const options = { 
            scales: {
              xAxes: [{
                ticks: {
                  fontSize: 10
                }
              }]
            },
            maintainAspectRatio: false,
            responsive:true
        };

        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.ContainerLineChart.title+this.props.id}</h3>
              </div>
              <div className="box-body">
                <Line data={this.state.usage_months} height={550} options={options}/>
              </div>
            </div>
        );
    }
}

module.exports = ContainerLineChart;