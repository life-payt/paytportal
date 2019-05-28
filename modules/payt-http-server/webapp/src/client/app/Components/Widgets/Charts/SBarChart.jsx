import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class SBarChart extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {strings:getAppState(),myBarChart:null};
        this.createChart = this.createChart.bind(this);
    }

    // Unbind change listener
    componentWillUnmount() {
      TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
      this.createChart(getAppState());
    }

    componentDidMount() {
        TranslationsStore.addChangeListener(this._onChange);
        this.createChart(getAppState());
    }

    createChart(strings){
        if(this.state.myBarChart != null)
          this.state.myBarChart.destroy();

        var ctx = document.getElementById("sbarchart").getContext("2d");
        var data = {
          labels: [strings.SBarChart.indif, strings.SBarChart.organic, strings.SBarChart.plast, strings.SBarChart.pap_cart, strings.SBarChart.glass],
          datasets: [{
              label: strings.SBarChart.containersRemoved,
              backgroundColor: "#7f7f7f",
              borderColor: "#7f7f7f",
              data: [40,0,0,0,0],
            }, {
              label: strings.SBarChart.containersInstalled,
              backgroundColor: "#c1c1c1",
              borderColor: "#c1c1c1",
              data: [20,0,0,0,0],
            }, {
              label: strings.SBarChart.containersRemoved,
              backgroundColor: "#984907",
              borderColor: "#984907",
              data: [0,30,0,0,0],
            }, {
              label: strings.SBarChart.containersInstalled,
              backgroundColor: "#cba282",
              borderColor: "#cba282",
              data: [0,20,0,0,0],
            }, {
              label: strings.SBarChart.containersRemoved,
              backgroundColor: "#f8be03",
              borderColor: "#f8be03",
              data: [0,0,60,0,0],
            }, {
              label: strings.SBarChart.containersInstalled,
              backgroundColor: "#ffde8a",
              borderColor: "#ffde8a",
              data: [0,0,20,0,0],
            }, {
              label: strings.SBarChart.containersRemoved,
              backgroundColor: "#356093",
              borderColor: "#356093",
              data: [0,0,0,20,0],
            }, {
              label: strings.SBarChart.containersInstalled,
              backgroundColor: "#97b8e0",
              borderColor: "#97b8e0",
              data: [0,0,0,10,0],
            }, {
              label: strings.SBarChart.containersRemoved,
              backgroundColor: "#769633",
              borderColor: "#769633",
              data: [0,0,0,0,15],
            }, {
              label: strings.SBarChart.containersInstalled,
              backgroundColor: "#ecf1db",
              borderColor: "#ecf1db",
              data: [0,0,0,0,15],
            }
          ]
        };

        var chart = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            scales: {
              xAxes: [{stacked: true}],
              yAxes: [{stacked: true}]
            },
            legend: {
              display: false
            },
            tooltips:{
              callbacks: {
                label: function(tooltipItem, data) {
                    var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            
                    // Loop through all datasets to get the actual total of the index
                    var total = 0;
                    for (var i = 0; i < data.datasets.length; i++)
                        total += data.datasets[i].data[tooltipItem.index];
            
                    // If it is not the last dataset, you display it as you usually do
                    if (tooltipItem.datasetIndex % 2 === 0) {
                        return strings.SBarChart.containersRemoved + ': ' + valor;
                    } else { // .. else, you display the dataset and the total, using an array
                        return [strings.SBarChart.containersInstalled + ': ' + total];
                    }
                }
              }
            }
          }
        });

        this.setState({myBarChart:chart});
    }

    render() {
        return (
          <div className="box box-success">
            <div className="box-header">
              <h3 className="box-title">{this.state.strings.SBarChart.title}</h3>
            </div>
            <div className="box-body">
              <canvas id="sbarchart" width="400" height="300"></canvas>
            </div>
          </div>
        );
    }
}

module.exports = SBarChart;