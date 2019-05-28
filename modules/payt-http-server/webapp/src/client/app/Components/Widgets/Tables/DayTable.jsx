import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class DayTable extends React.Component {
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
        var data;

        return(
            <BootstrapTable data={this.props.values} striped={true} hover={true} ref='detailstable'>
              <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" hidden={true} dataSort={true}>ID</TableHeaderColumn>
              <TableHeaderColumn dataField="day" dataAlign="center" dataSort={true}>{this.state.strings.DayTable.day}</TableHeaderColumn>
              <TableHeaderColumn dataField="month" dataFormat={this.formatMonth} dataAlign="center" dataSort={true}>{this.state.strings.DayTable.month}</TableHeaderColumn>
              <TableHeaderColumn dataField="year" dataAlign="center" dataSort={true}>{this.state.strings.DayTable.year}</TableHeaderColumn>
              <TableHeaderColumn dataField="value" dataAlign="center" dataSort={true}>{this.state.strings.DayTable.value}</TableHeaderColumn> 
            </BootstrapTable>
        );
    }
}

module.exports = DayTable;