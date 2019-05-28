import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class UsersTable extends React.Component {

    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onUserInfoChange = this._onUserInfoChange.bind(this);
        this.fetchUsages = this.fetchUsages.bind(this);

        this.state = {
            party: getParty(),
            strings: getAppState()
        };

        this.fetchUsages();
    }

    // Listen for changes
    componentDidMount() {
        TranslationsStore.addChangeListener(this._onChange);
        UserInfoStore.addChangeListener(this._onUserInfoChange);
    }

    // Unbind change listener
    componentWillUnmount() {
        TranslationsStore.removeChangeListener(this._onChange);
        UserInfoStore.removeChangeListener(this._onUserInfoChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    _onUserInfoChange() {
		this.setState({party: getParty()});
	}

    fetchUsages(){
        var start_date = moment().subtract(1,'months').toDate();
        var end_date = moment().toDate();
        var producer_id = this.state.party.producers[0].id;
        
        window.payt_session.call('payt.'+ window.county +'.get_daily_waste',{
            args: [producer_id,start_date,end_date],
            callback: function (res){
              console.log(res);
            }.bind(this),
            exchange: window.county
        });
    }

    render() {
        

        return(
            <div className="box box-success">
            {/*
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.UsagesTable.title}</h3>
              </div>
              <div className="box-body">
                <BootstrapTable data={this.state.users} striped={true} hover={true} options={options} selectRow={selectRow} deleteRow ref='userstable' search={ true } searchPlaceholder={this.state.strings.UsersTable.searchPlaceholder} pagination>
                  <TableHeaderColumn dataField="id" hidden={true} isKey={true} dataAlign="center" searchable={ false } width='10%'>ID</TableHeaderColumn>
                  <TableHeaderColumn dataField="username" dataAlign="center" dataSort={true} width='20%'>{this.state.strings.UsersTable.username}</TableHeaderColumn>
                  <TableHeaderColumn dataField="email" dataAlign="center" dataSort={true}>E-Mail</TableHeaderColumn>
                  <TableHeaderColumn dataField="counties" dataAlign="center" dataFormat={this.formatCounties} dataSort={false}>{this.state.strings.UsersTable.county}</TableHeaderColumn>
                  <TableHeaderColumn dataField="role" dataAlign="center" width='15%' dataSort={true}>{this.state.strings.UsersTable.role}</TableHeaderColumn>
                </BootstrapTable>
                <div className="pull-right" style={{paddingTop:10}}>
                  <button className="btn btn-success" type="submit" onClick={this.openModal.bind(this)}>{this.state.strings.UsersTable.add}</button>
                </div>
              </div>
            */}
            </div>
        );
    }
}

module.exports = UsersTable;