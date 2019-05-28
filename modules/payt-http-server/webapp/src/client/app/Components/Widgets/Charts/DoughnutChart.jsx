import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class DoughnutChart extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {strings:getAppState()};
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

    createChart(strings) {
        Chart.pluginService.register({
            beforeDraw: function (chart) {
              if (chart.config.options.elements.center) {
                //Get ctx from string
                var ctx = chart.chart.ctx;
                
                //Get options from the center object in options
                var centerConfig = chart.config.options.elements.center;
                var fontStyle = centerConfig.fontStyle || 'Arial';
                var txt = '53%';
                var color = '#000';
                var sidePadding = centerConfig.sidePadding || 20;
                var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
                //Start with a base font of 30px
                ctx.font = "40px " + fontStyle;
                
                //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                var stringWidth = ctx.measureText(txt).width;
                var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

                // Find out how much the font can grow in width.
                var widthRatio = elementWidth / stringWidth;
                var newFontSize = Math.floor(30 * widthRatio);
                var elementHeight = (chart.innerRadius * 2);

                // Pick a new font size so it will not be larger than the height of label.
                var fontSizeToUse = Math.min(newFontSize, elementHeight);

                //Set font settings to draw it correctly.
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                ctx.font = fontSizeToUse+"px " + fontStyle;
                ctx.fillStyle = color;
                
                //Draw text in center
              ctx.fillText(txt, centerX, centerY);
            }
          }
        });

        var config = {
          type: 'doughnut',
          data: {
            labels: [
              strings.DoughnutChart.indif,
              strings.DoughnutChart.organic,
              strings.DoughnutChart.pap_cart,
              strings.DoughnutChart.plast,
              strings.DoughnutChart.glass
            ],
            datasets: [{
              data: [1000, 300, 420, 170, 630],
              backgroundColor: [
                "#7F7F7F",
                "#984907",
                "#356093",
                "#f8be03",
                "#769633"
              ],
              hoverBackgroundColor: [
                "#7F7F7F",
                "#984907",
                "#356093",
                "#f8be03",
                "#769633"
              ]
            }]
          },
          options: {
            elements: {
              center: {
                text: '90%',
                color: '#FF6384', // Default is #000000
                fontStyle: 'Arial', // Default is Arial
                sidePadding: 20 // Defualt is 20 (as a percentage)
              }
            }
          }
        };


        var ctx = document.getElementById("doughnutchart").getContext("2d");
        var doughnutChart = new Chart(ctx,config);
    }

    render() {
        return (
          <div className="box box-success">
            <div className="box-header">
              <h3 className="box-title">{this.state.strings.DoughnutChart.title}</h3>
            </div>
            <div className="box-body">
              <canvas id="doughnutchart" width="400" height="300"></canvas>
            </div>
          </div>
        );
    }
}

module.exports = DoughnutChart;