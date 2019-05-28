import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';

import * as UserInfoActions from '../../Flux/Actions/UserInfoActions';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');
var UserInfoStore = require('../../Flux/Stores/UserInfoStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class LocationsTable extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onUserInfoChange = this._onUserInfoChange.bind(this);
        this.getLocations = this.getLocations.bind(this);
        this.hideProd = this.hideProd.bind(this);
        this.state = {strings:getAppState(),party: getParty(),locations:[]};
    }

    // Listen for changes
    componentDidMount() {
      TranslationsStore.addChangeListener(this._onChange);
      UserInfoStore.addChangeListener(this._onUserInfoChange);
      document.body.addEventListener('click', function() {
        $('.tooltip').hide();
        $('.tooltip').remove();
      });

      this.getLocations();
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
      this.getLocations();
    }
    
    hideProd(cell, row, rowIndex){
        // uncomment when hide address is done
        // hide address method
        // this.getLocations()
        console.log('hide address');
    }

    cellButton(cell, row, enumObject, rowIndex) {
        return (  <div id='list-actions'>
                    <li>
                      <a onClick={() => this.hideProd(cell, row, rowIndex)} style={{ fontSize:20, cursor: 'pointer' }}><i className="glyphicon glyphicon-eye-close"></i></a>
                    </li>
                  </div>
              );
    }

    getLocations() {
        var res = [];

        for(var i=0; i<this.state.party.producers.length; i++){
            var producer = this.state.party.producers[i];
            //if(!producer.hidden) uncomment when hide address is done
              res.push({id:i, alias:producer.alias, address:producer.address});
        }

        this.setState({locations: res});
    }
    
    afterSaveCell(row, cellName, cellValue) {
      window.payt_session.call('payt.'+window.county+'.db.private.edit_alias', {
          args: [this.state.party.producers[row.id].id, cellValue],
          callback: function (res){
              console.log(res);
              UserInfoActions.updateAlias(window.county, row.id, cellValue);
          },
          exchange: window.county
      });
    }

    render() {
        const cellEdit = {
          mode: 'click', // click cell to edit
          afterSaveCell: this.afterSaveCell.bind(this),
        };

        var tooltip = {
          'data-original-title': this.state.strings.LocationsTable.tooltipText,
          'data-container': "td",
          'data-toggle': "tooltip",
          'data-placement': "bottom",
          'data-trigger': "hover",
        }

        return(
          <div className="box box-success">
              <div className="box-header">
                  <h3 className="box-title">{this.state.strings.LocationsTable.title}</h3>
              </div>
              <div className="box-body">
                  <BootstrapTable data={this.state.locations} striped={true} hover={true} ref='locationstable' cellEdit={cellEdit} pagination search searchPlaceholder={this.state.strings.LocationsTable.searchPlaceholder}>
                      <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" hidden={true}>ID</TableHeaderColumn>
                      <TableHeaderColumn dataField="alias" dataAlign="center" tdAttr={ tooltip } dataSort={true}>{this.state.strings.LocationsTable.alias}</TableHeaderColumn>
                      <TableHeaderColumn dataField="address" dataAlign="center" editable={false} dataSort={true}>{this.state.strings.LocationsTable.address}</TableHeaderColumn>
                      {/*<TableHeaderColumn dataAlign="center" editable={false} dataFormat={this.cellButton.bind(this)} width='20%'>{this.state.strings.LocationsTable.actions}</TableHeaderColumn>*/} 
                  </BootstrapTable>
              </div>
          </div>
        );
    }
}

module.exports = LocationsTable;