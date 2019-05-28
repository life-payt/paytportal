import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class MonthTable extends React.Component {
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

    formatValue(cell, row, enumObject, rowIndex) {
        return new String(row.value).replace(".",",") + ' €';
    }

    render() {
        return(
            <BootstrapTable data={this.props.values} striped={true} hover={true} ref='detailstable'>
              <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" hidden={true} dataSort={true}>ID</TableHeaderColumn>
              <TableHeaderColumn dataField="month" dataFormat={this.formatMonth} dataAlign="center" dataSort={true}>{this.state.strings.MonthTable.month}</TableHeaderColumn>
              <TableHeaderColumn dataField="year" dataAlign="center" dataSort={true}>{this.state.strings.MonthTable.year}</TableHeaderColumn>
              <TableHeaderColumn dataField="value" dataAlign="center" dataFormat={this.formatValue} dataSort={true}>{this.state.strings.MonthTable.value}</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

module.exports = MonthTable;