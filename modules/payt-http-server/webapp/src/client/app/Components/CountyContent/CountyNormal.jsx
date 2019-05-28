import React from 'react';
import {render} from 'react-dom';

import RowTwoWidgets from '../Widgets/Rows/RowTwoWidgets.jsx';
import RowFourWidgets from '../Widgets/Rows/RowFourWidgets.jsx';
import ContainerBarChart from '../Widgets/Containers/ContainerBarChart.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class CountyNormalContent extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.fetchProducersWaste = this.fetchProducersWaste.bind(this);
        this.setDayPref = this.setDayPref.bind(this);
        this.setWeekPref = this.setWeekPref.bind(this);
        this.setMonthPref = this.setMonthPref.bind(this);
        this.setTotalReal = this.setTotalReal.bind(this);
        this.setTotalSimul = this.setTotalSimul.bind(this);
        this.setPercActive = this.setPercActive.bind(this);
        this.setNrActive = this.setNrActive.bind(this);

        this.state = {
            strings: getAppState(),
            rawData: [],
            totalReal: null,
            totalSimul: null,
            perc_active: null,
            nr_active: null,
            dayPref: null,
            weekPref: null,
            monthPref: null,
        };

        window.payt_session.call('payt.'+window.county+'.db.private.get_total_real_bill', {callback: function (res){
            console.log('totalReal',res);
            if(res)
                this.setTotalReal(res + this.state.strings.CountyNormalContent.unit);
		}.bind(this),
            exchange: window.county
        });

        window.payt_session.call('payt.'+window.county+'.db.private.get_total_simulated_bill', {callback: function (res){
            console.log('totalSimul',res);
            if(res)
                this.setTotalSimul(res + this.state.strings.CountyNormalContent.unit);
		}.bind(this),
            exchange: window.county
        });

        window.payt_session.call('payt.'+window.county+'.db.private.get_count_validated', {callback: function (res){
            console.log('perc_active',res);
            if(res){
                this.setPercActive(res.perc.toFixed(2) + ' %');
                this.setNrActive(res.total);
            }
		}.bind(this),
            exchange: window.county
        });

        window.payt_session.call('payt.'+window.county+'.db.private.get_day_highest_waste', {callback: function (res){
            console.log('result day pref', res);
            if(!_.isEmpty(res)){
                let dpMonth = parseInt(res.day.split('-')[1])-1;
                let dpDay = res.day.split('-')[2];
                let dPref = { day: dpDay, month: dpMonth };
                this.setDayPref(dPref);
            }
		}.bind(this),
            exchange: window.county
        });

        window.payt_session.call('payt.'+window.county+'.db.private.get_week_highest_waste', {callback: function (res){
            console.log('result week pref', res);
            if(!_.isEmpty(res))
                this.setWeekPref(res.week_start + ' - ' + res.week_end);
		}.bind(this),
            exchange: window.county
        });

        window.payt_session.call('payt.'+window.county+'.db.private.get_month_highest_waste', {callback: function (res){
            if(!_.isEmpty(res) && res.date != '-'){
                let month = parseInt(res.month)-1;
                let mPref = {month: month, year: res.year};
                this.setMonthPref(mPref);
            }
		}.bind(this),
            exchange: window.county
        });
    }

    // Listen for changes
    componentDidMount() {
      TranslationsStore.addChangeListener(this._onChange);
      this.fetchProducersWaste();
    }

    // Unbind change listener
    componentWillUnmount() {
        TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    setTotalReal(val) { 
        this.setState({totalReal: val});
    }

    setTotalSimul(val) { 
        this.setState({totalSimul: val});
    }

    setPercActive(val) { 
        this.setState({perc_active: val});
    }

    setNrActive(val) { 
        this.setState({nr_active: val});
    }

    setDayPref(val) { 
        this.setState({dayPref: val});
    }

    setWeekPref(val) {
        this.setState({weekPref: val});
    }

    setMonthPref(val) {
        this.setState({monthPref: val});
    }

    fetchProducersWaste(){
        window.payt_session.call('payt.'+window.county+'.db.private.get_producers_waste', {args: [12], callback: function (res){
            console.log('result', res);
            this.setState({rawData: res});
		}.bind(this),
            exchange: window.county
        });
    }

    render() {
        let data = this.state.rawData;

        var dataValues = [];
        var dataLabels = [];

        data.forEach(el => {
            let dt = el.date.split('-');
            dataValues.push(el.waste);
            dataLabels.push(this.state.strings.Months[parseInt(dt[1])-1]+' '+dt[0]);
        });

        const barData = {
            labels: dataLabels,
            datasets: [
            {
                label: this.state.strings.CountyNormalContent.dataLabel,
                backgroundColor: 'rgba(0, 166, 90, 0.7)',
                borderColor: 'rgba(0, 166, 90, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(0, 166, 90, 1)',
                hoverBorderColor: 'rgba(0, 166, 90, 1)',
                data: dataValues
            }]
        };

        const options = { 
            scales: {
              xAxes: 	[{
                            ticks: {
                              fontSize: 10
                            }
                         }],
              yAxes: 	[{
                          ticks: {
                              min: 0
                          },
                          scaleLabel: {
                              display: true,
                              labelString: this.state.strings.CountyNormalContent.dataLabel + ' (L)'
                          }
                      }]
            },
            tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      return new String(tooltipItem.yLabel).replace(".",",") + ' L';
                  }
              }
            },
            maintainAspectRatio: false,
            responsive:true
          };

        var unit = this.state.strings.CountyNormalContent.unit;

        /* Month & Day & Week Pref */
        let { monthPref, dayPref, weekPref, totalReal, totalSimul, perc_active, nr_active } = this.state;

        var values = [
            totalReal ? totalReal : this.state.strings.Global.noData,
            totalSimul ? totalSimul : this.state.strings.Global.noData
        ];

        var texts=[this.state.strings.CountyNormalContent.totalReal,this.state.strings.CountyNormalContent.totalSimul];
        var colors=["bg-green","bg-green"];

        //var values1=['9h-10h','5 '+this.state.strings.Months[8],'23-30 '+this.state.strings.Months[8],mPref];
        var values1 = [
            perc_active ? perc_active + ' (' + nr_active + ')'  : this.state.strings.Global.noData, 
            dayPref ? dayPref.day + ' ' + this.state.strings.Months[dayPref.month] : this.state.strings.Global.noData, 
            weekPref ? weekPref : this.state.strings.Global.noData, 
            monthPref ? this.state.strings.Months[monthPref.month] + ' ' + monthPref.year : this.state.strings.Global.noData
        ];
        
        var texts1=[this.state.strings.CountyNormalContent.activeUsers,this.state.strings.CountyNormalContent.dayPref,this.state.strings.CountyNormalContent.weekPref,this.state.strings.CountyNormalContent.monthPref];
        var colors1=["bg-green disabled","bg-green disabled","bg-green disabled","bg-green disabled"];

        return (
            <div>
                <div className="row">
                    <RowTwoWidgets values={values} texts={texts} icons={["","","",""]} colors={colors}/>
                </div>
                <div className="row">
                    <RowFourWidgets type="personal" enable={false} details1="activeusers" details2="day" details3="week" details4="month" values={values1} texts={texts1} icons={["","","",""]} colors={colors1}/>
                </div>
                <div className="row">
                    <section className="col-lg-12" >
                        <ContainerBarChart title={this.state.strings.CountyNormalContent.barTitle} data={barData} options={options} height={400}/>
                    </section>
                </div>
            </div>
        );
    }
}

module.exports = CountyNormalContent;