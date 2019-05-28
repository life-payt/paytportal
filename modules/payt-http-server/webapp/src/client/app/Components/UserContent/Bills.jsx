import React from 'react';
import { render } from 'react-dom';
import Widget from '../Widgets/Widget.jsx';
import RangePicker from '../Widgets/RangePicker.jsx';
import BillsTable from '../Widgets/Tables/BillsTable.jsx';
import BillsChart from '../Widgets/Charts/BillsChart.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
    return TranslationsStore.getStrings();
}

function getParty() {
    return UserInfoStore.getUserInfo().partyAct;
}

class Bills extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onUserInfoChange = this._onUserInfoChange.bind(this);
        this.getData = this.getData.bind(this);
        var strings = getAppState();

        var ranges = {
            [strings.Bills.ranges[0]]: [moment().subtract(3, 'months').startOf('month'), moment().startOf('month')],
            [strings.Bills.ranges[1]]: [moment().subtract(6, 'months').startOf('month'), moment().startOf('month')],
            [strings.Bills.ranges[2]]: [moment().subtract(12, 'months').startOf('month'), moment().startOf('month')]
        };

        var party = getParty();

        this.state = {
            strings: strings,
            ranges: ranges,
            party: party,
            id: party.producers[0].id,
            real_bills: [],
            simul_bills: []
        }

        this.getData(party.producers[0].id, 6);
    }

    setRealBills(bills){
        this.setState({
            real_bills: bills,
        });
    }

    setSimulBills(bills){
        this.setState({
            simul_bills: bills,
        });
    }

    // Listen for changes
    componentDidMount() {
        TranslationsStore.addChangeListener(this._onChange);
        UserInfoStore.addChangeListener(this._onUserInfoChange);
    }

    // Unbind change listener
    componentWillUnmount() {
        TranslationsStore.removeChangeListener(this._onChange);
        UserInfoStore.removeChangeListener(this._onUserInfoChange);
    }

    _onChange() {
        var strings = getAppState();

        var ranges = { [strings.Bills.ranges[0]] : [moment().subtract(3, 'months').startOf('month'), moment().startOf('month')],
                     [strings.Bills.ranges[1]] : [moment().subtract(6, 'months').startOf('month'), moment().startOf('month')],
                     [strings.Bills.ranges[2]] : [moment().subtract(12, 'months').startOf('month'), moment().startOf('month')]};
      
        this.setState({strings:strings,ranges:ranges});
    }

    _onUserInfoChange() {
        this.setState({ party: getParty() });
    }

    handleEvent(id, picker) {
        var nMonths = moment().diff(picker.startDate, 'months');
        this.getData(id, nMonths);
    }

    getData(id, nMonths) {
        window.payt_session.call('payt.'+window.county+'.db.private.get_producer_real_bills', {args: [id,nMonths], callback: function (res){
            if(res != null){
                var tmp = [];
                res.forEach((el,index) => {
                    tmp.push({
                        period_begin: el.period_begin,
                        period_end: el.period_end,
                        value: el.value
                    });
                });
                this.setRealBills(tmp);
            }
        }.bind(this),
                exchange: window.county
        });

        window.payt_session.call('payt.'+window.county+'.db.private.get_producer_simulated_bills', {args: [id,nMonths], callback: function (res){
            if(res != null){
                var tmp = [];
                res.forEach((el,index) => {
                    tmp.push({
                        period_begin: el.period_begin,
                        period_end: el.period_end,
                        value: el.value
                    });
                });
                this.setSimulBills(tmp);
            }
        }.bind(this),
                exchange: window.county
        });
    }

    render() {
        let { data, real, simulated, id } = this.state;

        const options = { 
            scales: {
            xAxes: [{
                  ticks: {
                    fontSize: 10
                  }
                }]
            },
            tooltips: {
                mode: 'point',
                callbacks: {
                    title: (tooltipItem, data) => {
                        let bill = this.state.real_bills[tooltipItem[0].index];
                        let from = this.state.strings.Bills.from + bill.period_begin;
                        let to = this.state.strings.Bills.to + bill.period_end;
                        return [from, to, ''];
                    },
                    label: function(tooltipItem, data) {
                        return new String(tooltipItem.yLabel).replace(".",",") + ' €';
                    }
                }
            },
            maintainAspectRatio: false,
            responsive:true
        };

        return (
            <div>
                <div className="row">
                    <div className="col-lg-2" style={{ marginBottom: 20 }}>
                        <RangePicker ranges={this.state.ranges} onApply={this.handleEvent.bind(this, id)} />
                    </div>
                </div>
                <div className="row">
                    <div id='details_bills' className="col-lg-12">
                        <div className="row">
                            <div className="col-sm-6 col-xs-12">
                                <Widget value={real || this.state.strings.Global.noData} text={this.state.strings.Bills.defaultRange.real} color='bg-green' enable={false}/>
                                <div className="box">
                                    <div className="box-header">
                                        <h3 className="box-title">{this.state.strings.Bills.formula}</h3>
                                    </div>
                                    <div className="box-body">
                                        {this.state.strings.Bills.formulaBody}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-xs-12">
                                <Widget value={simulated || this.state.strings.Global.noData} text={this.state.strings.Bills.defaultRange.simulated} color='bg-green' enable={false}/>
                                <div className="box">
                                    <div className="box-header">
                                        <h3 className="box-title">{this.state.strings.Bills.formula}</h3>
                                    </div>
                                    <div className="box-body">
                                        {this.state.strings.Bills.formulaBody}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <BillsTable real_bills={this.state.real_bills} simul_bills={this.state.simul_bills}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <BillsChart height={435} options={options} real_bills={this.state.real_bills} simul_bills={this.state.simul_bills}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Bills;