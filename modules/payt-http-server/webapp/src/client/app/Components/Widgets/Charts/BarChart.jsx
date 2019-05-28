import React from 'react';
import {render} from 'react-dom';

import {Line,Bar} from 'react-chartjs-2';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class BarChart extends React.Component {
    constructor(props){
        super(props);

        var strings = getAppState();

        this.state = {
            data1: [10, 8, 6, 13, 17, 9, 9, 9, 7, 8, 8, 6],
            data2: [8, 9, 7, 6, 14, 5, 11, 15, 10, 12, 7, 9],
            data3: [7, 6, 5, 7, 11, 8, 10, 11, 8, 10, 5, 10],
            data4: [9, 7, 9, 8, 12, 6, 7, 6, 9, 11, 6, 7],
            data5: [9, 7, 9, 8, 12, 6, 7, 6, 9, 11, 6, 7],
            strings: strings
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

    formatData(values1,values2,values3,values4,values5) {
        var dataValues1 = [];
        var dataValues2 = [];
        var dataValues3 = [];
        var dataValues4 = [];
        var dataValues5 = [];
        var dataLabels = [];
        for(var i=0; i<values1.length; i++){
            dataValues1.push(values1[i]);
            dataValues2.push(values2[i]);
            dataValues3.push(values3[i]);
            dataValues4.push(values4[i]);
            dataValues5.push(values4[i]);
            dataLabels.push(this.state.strings.Months[i]);
        }

        const data = {
          labels: dataLabels,
          datasets: [
            {
              label: this.state.strings.BarChart.indif,
              backgroundColor: 'rgba(125, 128, 132, 0.6)',
              borderColor: 'rgba(125, 128, 132, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(125, 128, 132, 1)',
              hoverBorderColor: 'rgba(125, 128, 132, 1)',
              data: dataValues1
            },
            {
              label: this.state.strings.BarChart.pap_cart,
              backgroundColor: 'rgba(66, 128, 244, 0.6)',
              borderColor: 'rgba(66, 128, 244, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(66, 128, 244, 1)',
              hoverBorderColor: 'rgba(66, 128, 244, 1)',
              data: dataValues2
            },
            {
              label: this.state.strings.BarChart.glass,
              backgroundColor: 'rgba(19, 173, 13, 0.6)',
              borderColor: 'rgba(19, 173, 13, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(19, 173, 13, 1)',
              hoverBorderColor: 'rgba(19, 173, 13, 1)',
              data: dataValues3
            },
            {
              label: this.state.strings.BarChart.plast,
              backgroundColor: 'rgba(233, 237, 21, 0.6)',
              borderColor: 'rgba(233, 237, 21, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(233, 237, 21, 1)',
              hoverBorderColor: 'rgba(233, 237, 21, 1)',
              data: dataValues4
            },
            {
              label: this.state.strings.BarChart.organic,
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

    exportJSON(d,t,event){
        var datasets = d.datasets;
        var labels = d.labels;
        var res = [];

        for(var i=0;i<datasets.length;i++){
          var type = datasets[i].label;
          var obj = datasets[i];
          var tmp = [];
          for(var j=0;j<obj.data.length;j++){
            var val = labels[j];
            if(t=='containers')
              tmp.push({ [this.state.strings.BarChart.capacity] : val , [this.state.strings.BarChart.quantity] : obj.data[j]});
            else if(t=='waste')
              tmp.push({ [this.state.strings.BarChart.month] : val , [this.state.strings.BarChart.quantity] : obj.data[j]});
            //console.log(val);
          }
          if(t=='containers')
            res.push({ [this.state.strings.BarChart.type] : type, [this.state.strings.BarChart.containers] : tmp});
          else if(t=='waste')
            res.push({ [this.state.strings.BarChart.type] : type, [this.state.strings.BarChart.waste] : tmp});
        }
        
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res, null, "\t"));
        // what to return in order to show download window?
        
        event.target.setAttribute("href", "data:"+data);
        event.target.setAttribute("download", "data.json");
    }

    render() {
        var data;
        var title;
        var type = this.props.type;

        if(this.props.data!=null)
          data = this.props.data;
        else
          data = this.formatData(this.state.data1,this.state.data2,this.state.data3,this.state.data4);
        

        if(type == 'containers')
          title = this.state.strings.BarChart.containersTitle;
        else
          title = this.state.strings.BarChart.wasteTitle;

        return(
            <div className="box box-success">
              <div className="box-header with-border">
                <i className="fa fa-bar-chart-o"></i>
                <h3 className="box-title">{title}</h3>
                <a id="exportJSON" onClick={this.exportJSON.bind(this,data,type)} className="btn btn-default pull-right">
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

module.exports = BarChart;