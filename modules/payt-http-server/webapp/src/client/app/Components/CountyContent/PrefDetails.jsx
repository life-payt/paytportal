import React from 'react';
import { render } from 'react-dom';
import MonthTable from '../Widgets/Tables/MonthTable.jsx';
import MonthChart from '../Widgets/Charts/MonthChart.jsx';
import HourTable from '../Widgets/Tables/HourTable.jsx';
import HourChart from '../Widgets/Charts/HourChart.jsx';
import DayTable from '../Widgets/Tables/DayTable.jsx';
import DayChart from '../Widgets/Charts/DayChart.jsx';
import WeekTable from '../Widgets/Tables/WeekTable.jsx';
import WeekChart from '../Widgets/Charts/WeekChart.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
    return TranslationsStore.getStrings();
}

class PrefDetails extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);

        var type = props.match.url.split('/')[3].split('-')[0];

        this.state = {
            strings: getAppState(),
            type: type
        }
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
        this.setState({ strings: getAppState()});
    }

    render() {
        var detailsText = "";
        var data = [];
        var table;
        var chart;
        var value;

        switch (this.state.type) {
            case "hour":
                detailsText = this.state.strings.Details.detailsTextHour;
                value = '9h-10h';
                data = [{
                    id: 1,
                    hour: "9h-10h",
                    value: 9.17
                }, {
                    id: 2,
                    hour: "10h-11h",
                    value: 10.4
                }, {
                    id: 3,
                    hour: "11h-12h",
                    value: 3.9
                }, {
                    id: 4,
                    hour: "12h-13h",
                    value: 8.7
                }, {
                    id: 5,
                    hour: "13h-14h",
                    value: 8.1
                }, {
                    id: 6,
                    hour: "14h-15h",
                    value: 7.9
                }];
                table = <HourTable values={data} />;
                chart = <HourChart text={detailsText} values={data} unit=' L' yLabel={this.state.strings.Details.yLabel['waste']} />;
                break;
            case "day":
                detailsText = this.state.strings.Details.detailsTextDay;
                value = '5 '+this.state.strings.Months[8];
                data = [{
                    id: 1,
                    day: " 1",
                    month: 2,
                    year: "2016",
                    value: 5.67
                }, {
                    id: 2,
                    day: " 2",
                    month: 2,
                    year: "2016",
                    value: 3.7
                }, {
                    id: 3,
                    day: "3",
                    month: 2,
                    year: "2016",
                    value: 6.9
                }, {
                    id: 4,
                    day: " 4",
                    month: 2,
                    year: "2016",
                    value: 9.5
                }, {
                    id: 5,
                    day: " 5",
                    month: 2,
                    year: "2016",
                    value: 6.38
                }, {
                    id: 6,
                    day: " 6",
                    month: 2,
                    year: "2016",
                    value: 5.56
                }];
                table = <DayTable values={data} />;
                chart = <DayChart text={detailsText} values={data} unit=' L' yLabel={this.state.strings.Details.yLabel['waste']} />;
                break;
            case "week":
                detailsText = this.state.strings.Details.detailsTextWeek;
                value = '23-30 '+this.state.strings.Months[8];
                data = [{
                    id: 1,
                    week: "Semana 1",
                    month: 2,
                    value: 6.67
                }, {
                    id: 2,
                    week: "Semana 2",
                    month: 2,
                    value: 4.8
                }, {
                    id: 3,
                    week: "Semana 3",
                    month: 2,
                    value: 9.13
                }, {
                    id: 4,
                    week: "Semana 4",
                    month: 2,
                    value: 8.4
                }];
                table = <WeekTable values={data} />;
                chart = <WeekChart text={detailsText} values={data} unit=' L' yLabel={this.state.strings.Details.yLabel['waste']} />;
                break;
            case "month":
                detailsText = this.state.strings.Details.detailsTextMonth;
                value = this.state.strings.Months[7] + ' 2017';
                data = [{
                    id: 1,
                    month: 3,
                    year: "2016",
                    value: 8.67
                }, {
                    id: 2,
                    month: 4,
                    year: "2016",
                    value: 9.3
                }, {
                    id: 3,
                    month: 5,
                    year: "2016",
                    value: 6.9
                }, {
                    id: 4,
                    month: 6,
                    year: "2016",
                    value: 8.4
                }, {
                    id: 5,
                    month: 7,
                    year: "2016",
                    value: 9.1
                }, {
                    id: 6,
                    month: 8,
                    year: "2016",
                    value: 7.9
                }];

                table = <MonthTable values={data} />;
                chart = <MonthChart text={detailsText} values={data} unit=' L' yLabel={this.state.strings.Details.yLabel['waste']} />;
                break;
            default:
                break;
        }

        return (
            <div id='details' className="row">
                <div className="col-lg-6 col-md-12">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className='bg-green small-box'>
                                <div className="inner">
                                    <h3>{value}</h3>

                                    <p>{this.state.strings.Details.defaultText[this.state.type]}</p>
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
                                    {table}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12">
                    {chart}
                </div>
            </div>
        );
    }
}

module.exports = PrefDetails;