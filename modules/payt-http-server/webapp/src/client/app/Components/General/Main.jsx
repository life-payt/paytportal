import React from 'react';
import {render} from 'react-dom';
import CountUp from 'react-countup';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class Main extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {strings:getAppState()};
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

    render() {
        return(
            <section id="main-content">
                    <div className="row" id="main-row">
                        <div className="col-md-3 col-sm-12 col-xs-12">
                            <div id="left-row">
                                <div className="title">
                                    <h1>{this.state.strings.General.Main.stats}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 col-sm-12 col-xs-12">
                            <div id="right-first-row">
                                <div className="col-md-4 col-sm-4 col-xs-6">
                                    <div className="single-counter">
                                        <h1 id="count1"><CountUp start={0} end={776} duration={2.5} separator=' '/></h1>
                                        <h4>{this.state.strings.General.Main.nrUsers}</h4>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-4 col-xs-6">
                                    <div className="single-counter">
                                        <h1 id="count2"><CountUp start={0} end={26} duration={2.5} separator=' '/></h1>
                                        <h4>{this.state.strings.General.Main.nrContainers}</h4>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-4 col-xs-12">
                                    <div className="single-counter">
                                        <h1 id="count3"><CountUp start={0} end={5} duration={5} separator=' '/></h1>
                                        <h4>{this.state.strings.General.Main.nrCounties}</h4>
                                    </div>
                                </div>
                            </div>
                            {/*
                            <div id="right-second-row">
                                <div className="col-md-4 col-sm-offset-2 col-sm-4 col-xs-6">
                                    <div className="single-counter">
                                        <h1 id="count4"><CountUp start={0} end={40012} suffix=" L" duration={2.5} separator=' '/></h1>
                                        <h4>{this.state.strings.General.Main.totalWaste}</h4>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-4 col-xs-6">
                                    <div className="single-counter">
                                        <h1 id="count5"><CountUp start={0} end={500} suffix=" L" duration={2.5} separator=' '/></h1>
                                        <h4>{this.state.strings.General.Main.avgMonthWaste}</h4>
                                    </div>
                                </div>
                            </div>*/}
                        </div>
                    </div>
                </section>
        );
    }
}

module.exports = Main;