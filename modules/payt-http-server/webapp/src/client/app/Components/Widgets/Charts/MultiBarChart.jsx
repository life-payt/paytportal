import React from 'react';
import {render} from 'react-dom';

import {Line,Bar} from 'react-chartjs-2';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class MultiBarChart extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            strings: getAppState(),
        }

        this._onChange = this._onChange.bind(this);
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

    formatData(rawData) {
        var dataValues1 = [];
        var dataValues2 = [];
        var dataValues3 = [];
        var dataValues4 = [];
        var dataValues5 = [];
        var dataLabels = [];
        for(var i=0; i<rawData.length; i++){
            let date = rawData[i]['date'].split('-');
            let month = parseInt(date[1])-1;
            dataValues1.push(rawData[i]['waste']['I'] || 0); // Indiferienciados
            dataValues2.push(rawData[i]['waste']['E'] || 0); // Embalagens
            dataValues3.push(rawData[i]['waste']['V'] || 0); // Vidro
            dataValues4.push(rawData[i]['waste']['P'] || 0); // Plástico
            dataValues5.push(rawData[i]['waste']['O'] || 0); // Orgânico
            dataLabels.push(this.state.strings.Months[month].substring(0,3) + ' ' + date[0]);
        }

        const data = {
          labels: dataLabels,
          datasets: [
            {
              label: this.state.strings.MultiBarChart.indif,
              backgroundColor: 'rgba(125, 128, 132, 0.6)',
              borderColor: 'rgba(125, 128, 132, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(125, 128, 132, 1)',
              hoverBorderColor: 'rgba(125, 128, 132, 1)',
              data: dataValues1
            },
            {
              label: this.state.strings.MultiBarChart.pap_cart,
              backgroundColor: 'rgba(66, 128, 244, 0.6)',
              borderColor: 'rgba(66, 128, 244, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(66, 128, 244, 1)',
              hoverBorderColor: 'rgba(66, 128, 244, 1)',
              data: dataValues2
            },
            {
              label: this.state.strings.MultiBarChart.glass,
              backgroundColor: 'rgba(19, 173, 13, 0.6)',
              borderColor: 'rgba(19, 173, 13, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(19, 173, 13, 1)',
              hoverBorderColor: 'rgba(19, 173, 13, 1)',
              data: dataValues3
            },
            {
              label: this.state.strings.MultiBarChart.plast,
              backgroundColor: 'rgba(233, 237, 21, 0.6)',
              borderColor: 'rgba(233, 237, 21, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(233, 237, 21, 1)',
              hoverBorderColor: 'rgba(233, 237, 21, 1)',
              data: dataValues4
            },
            {
              label: this.state.strings.MultiBarChart.organic,
              backgroundColor: 'rgba(203, 162, 130, 1)',
              borderColor: 'rgba(152, 73, 7, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(152, 73, 7, 1)',
              hoverBorderColor: 'rgba(152, 73, 7, 1)',
              data: dataValues5
            }
          ]
        };

        return data;
    }

    exportJSON(d,event){
        var datasets = d.datasets;
        var labels = d.labels;
        var res = [];

        for(var i=0;i<datasets.length;i++){
            var type = datasets[i].label;
            var obj = datasets[i];
            var tmp = [];
            for(var j=0;j<obj.data.length;j++){
                var val = labels[j];
                tmp.push({ [this.state.strings.MultiBarChart.month] : val , [this.state.strings.MultiBarChart.quantity] : obj.data[j]});
            }
            res.push({ [this.state.strings.MultiBarChart.type] : type, [this.state.strings.MultiBarChart.waste] : tmp});
        }
        
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res, null, "\t"));
        
        event.target.setAttribute("href", "data:"+data);
        event.target.setAttribute("download", "data.json");
    }

    render() {
        var data = this.formatData(this.props.data);
        var title = this.state.strings.MultiBarChart.wasteTitle;

        return(
            <div className="box box-success">
              <div className="box-header with-border">
                <i className="fa fa-bar-chart-o"></i>
                <h3 className="box-title">{title}</h3>
                <a id="exportJSON" onClick={this.exportJSON.bind(this,data)} className="btn btn-default pull-right">
                  <i className="fa fa-download"></i> Download
                </a>
              </div>
              <div className="box-body">
                <Bar data={data} height={400} options={{ maintainAspectRatio: false }}/>
              </div>
            </div>
        );
    }
}

module.exports = MultiBarChart;