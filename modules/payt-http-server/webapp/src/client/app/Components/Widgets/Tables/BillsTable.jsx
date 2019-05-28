import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class BillsTable extends React.Component {

    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.formatData = this.formatData.bind(this);

        this.state = { strings: getAppState() };
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

    formatData() {
        var { real_bills, simul_bills } = this.props;
        var data = [];

        for (let i = 0; i < real_bills.length; i++) {
            const r_bill = real_bills[i];
            const s_bill = simul_bills[i];
            
            data.push({
                id: i,
                from: real_bills[i].period_begin,
                to: real_bills[i].period_end,
                real: real_bills[i].value + ' €',
                simul: simul_bills[i] ? simul_bills[i].value + ' €' : 'n/d'
            });
        }

        return data;
    }

    render() {
        var data = this.formatData();

        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.BillsTable.title}</h3>
              </div>
              <div className="box-body">
                <BootstrapTable data={data} striped={true} hover={true}>
                  <TableHeaderColumn row='0' rowSpan='2' dataField="id" isKey={true} hidden dataAlign="center"></TableHeaderColumn>
                  <TableHeaderColumn row='0' rowSpan='2' dataField="from" dataAlign="center">{this.state.strings.BillsTable.from}</TableHeaderColumn>
                  <TableHeaderColumn row='0' rowSpan='2' dataField="to" dataAlign="center">{this.state.strings.BillsTable.to}</TableHeaderColumn>
                  <TableHeaderColumn row='0' colSpan='2' dataAlign="center" dataSort={true}>{this.state.strings.BillsTable.value}</TableHeaderColumn>
                  <TableHeaderColumn row='1' dataField="real" dataAlign="center" dataSort>{this.state.strings.BillsTable.real}</TableHeaderColumn>
                  <TableHeaderColumn row='1' dataField="simul" dataAlign="center" dataSort>{this.state.strings.BillsTable.simul}</TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
        );
    }
}

module.exports = BillsTable;