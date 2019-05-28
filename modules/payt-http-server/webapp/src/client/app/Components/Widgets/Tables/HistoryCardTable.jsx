import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class HistoryCardTable extends React.Component {

    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.formatData = this.formatData.bind(this);

        this.state = { strings: getAppState(), history: [] };
    }

    // Listen for changes
    componentDidMount() {
      TranslationsStore.addChangeListener(this._onChange);
      this.formatData();
    }

    // Unbind change listener
    componentWillUnmount() {
      TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    formatData() {
        var tmp = [];
        window.payt_session.call('payt.'+ window.county +'.db.private.get_card_history',{
            args: [this.props.id],
            callback: function(res){
                console.log(res);
                res.forEach((el,idx) => {
                    tmp.push({
                        id: idx,
                        message: el.message,
                        producer: el.producer.replace(/{|}/g,''),
                        timestamp: el.timestamp
                    });
                });
                this.setState({
                    history: tmp
                });
            }.bind(this),
            exchange: window.county
        });
    }

    render() {
        return(
            <BootstrapTable data={this.state.history} striped hover>
                <TableHeaderColumn dataField="id" isKey={true} hidden dataAlign="center"></TableHeaderColumn>
                <TableHeaderColumn dataField="message" dataAlign="center" tdStyle={ { overflow: 'scroll', textOverflow: 'inherit' } }>{this.state.strings.HistoryCardTable.message}</TableHeaderColumn>
                <TableHeaderColumn dataField="producer" dataAlign="center">{this.state.strings.HistoryCardTable.producer}</TableHeaderColumn>
                <TableHeaderColumn dataField="timestamp" dataAlign="center">{this.state.strings.HistoryCardTable.timestamp}</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

module.exports = HistoryCardTable;