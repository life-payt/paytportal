import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class ContainersTable extends React.Component {

    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.fetchContainers = this.fetchContainers.bind(this);

        this.state = {
          containers_usage : [],
          strings: getAppState()
        };

        this.fetchContainers()
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

    fetchContainers() {
        window.payt_session.call('payt.'+window.county+'.db.private.get_containers_usage', {callback: function (res){
            var tmp =[];
            Object.keys(res).forEach(id => {
                tmp.push({
                    id: id, 
                    lastSixMonths: res[id].col4, 
                    lastMonth: res[id].col3,
                    lastWeek: res[id].col2,
                    lastDay: res[id].col1
                })
            });
            this.setState({containers_usage: tmp});
		    }.bind(this),
            exchange: window.county
        });
    }

    render() {
        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.ContainersTable.title}</h3>
              </div>
              <div className="box-body">
                <BootstrapTable data={this.state.containers_usage} striped={true} hover={true} pagination>
                  <TableHeaderColumn row='0' rowSpan='2' dataField="id" isKey={true} dataAlign="center">{this.state.strings.ContainersTable.name}</TableHeaderColumn>
                  <TableHeaderColumn row='0' colSpan='4' dataAlign="center" dataSort={true}>{this.state.strings.ContainersTable.usage}</TableHeaderColumn>
                  <TableHeaderColumn row='1' dataField="lastSixMonths" dataAlign="center" dataSort>{this.state.strings.ContainersTable.lastSixMonths}</TableHeaderColumn>
                  <TableHeaderColumn row='1' dataField="lastMonth" dataAlign="center" dataSort>{this.state.strings.ContainersTable.lastMonth}</TableHeaderColumn>
                  <TableHeaderColumn row='1' dataField="lastWeek" dataAlign="center" dataSort>{this.state.strings.ContainersTable.lastWeek}</TableHeaderColumn>
                  <TableHeaderColumn row='1' dataField="lastDay" dataAlign="center" dataSort>{this.state.strings.ContainersTable.lastDay}</TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
        );
    }
}

module.exports = ContainersTable;