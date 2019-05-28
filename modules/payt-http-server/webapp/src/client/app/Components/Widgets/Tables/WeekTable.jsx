import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class WeekTable extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.formatMonth = this.formatMonth.bind(this);
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

    formatMonth(cell, row, enumObject, rowIndex) {
        return this.state.strings.Months[cell];
    }  

    render() {
        return(
            <BootstrapTable data={this.props.values} striped={true} hover={true} ref='detailstable'>
              <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" hidden={true} dataSort={true}>ID</TableHeaderColumn>
              <TableHeaderColumn dataField="week" dataAlign="center" dataSort={true}>{this.state.strings.WeekTable.week}</TableHeaderColumn>
              <TableHeaderColumn dataField="month" dataFormat={this.formatMonth} dataAlign="center" dataSort={true}>{this.state.strings.WeekTable.month}</TableHeaderColumn>
              <TableHeaderColumn dataField="value" dataAlign="center" dataSort={true}>{this.state.strings.WeekTable.value}</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

module.exports = WeekTable;