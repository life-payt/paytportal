import React from 'react';
import { render } from 'react-dom';
import RangePicker from '../Widgets/RangePicker.jsx';
import MonthTable from '../Widgets/Tables/MonthTable.jsx';
import MonthChart from '../Widgets/Charts/MonthChart.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
    return TranslationsStore.getStrings();
}

function getParty() {
    return UserInfoStore.getUserInfo().partyAct;
}

class BillDetails extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onUserInfoChange = this._onUserInfoChange.bind(this);
        this.getData = this.getData.bind(this);
        var strings = getAppState();

        var ranges = {
            [strings.Details.ranges[0]]: [moment().subtract(3, 'months').startOf('month'), moment().startOf('month')],
            [strings.Details.ranges[1]]: [moment().subtract(6, 'months').startOf('month'), moment().startOf('month')],
            [strings.Details.ranges[2]]: [moment().subtract(12, 'months').startOf('month'), moment().startOf('month')]
        };

        var party = getParty();
        var index = props.match.params.id;
        var type = props.match.url.split('/')[4].split('-')[0];

        this.state = {
            label: strings.Details.labelInt,
            data: [],
            strings: strings,
            widgetLabel: strings.Details.defaultRange,
            ranges: ranges,
            party: party,
            index: index,
            real: '---',
            type: type
        }

        this.getData(party.producers[index].id, 6);

        window.payt_session.call('payt.' + window.county + '.db.private.get_producer_'+type+'_bill',{ args: [party.producers[index].id], 
            callback: function (res) {
                if (res != null)
                    this.setReal(res.value + ' €');
                else
                    this.setReal(strings.Global.noData);
            }.bind(this),
            exchange: window.county
        });
    }

    setReal(real){
        this.setState({
            real: real,
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

        var ranges = { [strings.Details.ranges[0]] : [moment().subtract(3, 'months').startOf('month'), moment().startOf('month')],
                     [strings.Details.ranges[1]] : [moment().subtract(6, 'months').startOf('month'), moment().startOf('month')],
                     [strings.Details.ranges[2]] : [moment().subtract(12, 'months').startOf('month'), moment().startOf('month')]};
      
        this.setState({strings:strings,label:strings.Details.labelInt,ranges:ranges});
    }

    _onUserInfoChange() {
        this.setState({ party: getParty() });
    }

    handleEvent(id, picker) {

        this.setState({
            label: '   ' + picker.chosenLabel + '   ',
        });

        var nMonths = moment().diff(picker.startDate, 'months');

        this.getData(id, nMonths);
    }

    getData(id, nMonths) {
        window.payt_session.call('payt.' + window.county + '.db.private.get_producer_'+this.state.type+'_bills', {
            args: [id, nMonths], callback: function (res) {

                var data = [];

                for (var i = 0; i < res.length; i++) {
                    var value = res[i].value;
                    var date = res[i].issue_date;
                    var month = parseInt(date.split('-')[1]) - 1;
                    var year = date.split('-')[0];

                    var obj = {
                        id: i + 1,
                        month: month,
                        year: year,
                        value: value
                    };

                    data[i] = obj;
                }

                this.setState({
                    data: data
                });

            }.bind(this),
            exchange: window.county
        });
    }

    render() {
        let initialData = null;
        let detailsText = this.state.strings.Details.detailsTextMonth;
        let id = this.state.party.producers[this.state.index].id;
        let { data, real } = this.state;

        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="box">
                            <div className="box-header">
                                <h3 className="box-title">{this.state.strings.Details.formula}</h3>
                            </div>
                            <div className="box-body">
                                {this.state.strings.Details.formulaBody}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-2" style={{ marginBottom: 20 }}>
                        <RangePicker ranges={this.state.ranges} onApply={this.handleEvent.bind(this, id)} />
                    </div>
                </div>
                <div className="row">
                    <div id='details_sum' className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-6 col-md-12">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className='bg-green small-box'>
                                            <div className="inner">
                                                <h3>{real}</h3>

                                                <p>{this.state.strings.Details.defaultRange[this.state.type]}</p>
                                            </div>
                                            <div className="icon">
                                                <i className={this.props.icon}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <h3 className="box-title">{detailsText}</h3>
                                            </div>
                                            <div className="box-body">
                                                <MonthTable values={data} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <MonthChart text={detailsText} values={data} unit=' €' yLabel={this.state.strings.Details.yLabel['money']} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = BillDetails;