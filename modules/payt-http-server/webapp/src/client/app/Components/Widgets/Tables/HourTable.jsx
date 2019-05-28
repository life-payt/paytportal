import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class HourTable extends React.Component {
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
            <BootstrapTable data={this.props.values} striped={true} hover={true} ref='detailstable'>
              <TableHeaderColumn dataField="id" isKey={true} dataAlign="left" hidden={true} dataSort={true}>ID</TableHeaderColumn>
              <TableHeaderColumn dataField="hour" dataAlign="left" dataSort={true}>{this.state.strings.HourTable.hour}</TableHeaderColumn>
              <TableHeaderColumn dataField="value" dataAlign="left" dataSort={true}>{this.state.strings.HourTable.value}</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

module.exports = HourTable;