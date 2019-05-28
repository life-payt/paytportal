import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

var elasticsearch = require('elasticsearch');
/*var client = new elasticsearch.Client({
  host: 'localhost:9200',
  apiVersion: '6.0'
});*/

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class LoginTable extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);

        /*  Uncomment when elk running

        client.search({
          index: 'filebeat-*',
          body: {
            query: {
              match: {
                action: 'Login'
              }
            },
            size: 100
          }
        }).then(function (resp) {
            this.formatData(resp.hits.hits);
        }.bind(this), function (err) {
            console.trace(err.message);
        });*/

        this.state = {strings:getAppState(),users: []};
    }

    formatData(logins){
        var res = [];
        for(var i=0; i<logins.length; i++){
            var tmp = logins[i]['_source'];
            var dt = new Date(tmp['@timestamp']).toLocaleDateString();
            res.push({id: i, user: tmp.user, type: tmp.role, auth: tmp.result, date: dt});
        }

        this.setState({users:res});
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

    authFormat(cell) {
        if(cell === 'Success')
          return (<span className="label label-success">{this.state.strings.LoginTable.approved}</span>);
        else
          return (<span className="label label-danger">{this.state.strings.LoginTable.denied}</span>);
    }

    render() {
        return(
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.LoginTable.title}</h3>
              </div>
              <div className="box-body">
                <BootstrapTable data={this.state.users} striped={true} hover={true} pagination search searchPlaceholder={this.state.strings.LoginTable.searchPlaceholder}>
                  <TableHeaderColumn dataField="id" isKey={true} headerAlign="center" dataAlign="center" width='10%'>ID</TableHeaderColumn>
                  <TableHeaderColumn dataField="user" dataAlign="center" dataSort={true}>{this.state.strings.LoginTable.user}</TableHeaderColumn>
                  <TableHeaderColumn dataField="type" dataAlign="center" dataSort={true}>{this.state.strings.LoginTable.type}</TableHeaderColumn>
                  <TableHeaderColumn dataField="auth" dataFormat={this.authFormat.bind(this)} dataAlign="center" dataSort={true}>{this.state.strings.LoginTable.auth}</TableHeaderColumn>
                  <TableHeaderColumn dataField="date" dataAlign="center" dataSort={true}>{this.state.strings.LoginTable.date}</TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
        );
    }
}

module.exports = LoginTable;