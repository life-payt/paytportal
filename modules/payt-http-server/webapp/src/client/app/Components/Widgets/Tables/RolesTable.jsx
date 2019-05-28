import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import RoleForm from '../Forms/RoleForm.jsx';
import Modal from '../Modal.jsx';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class RolesTable extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.fetchRoles = this.fetchRoles.bind(this);

        this.state = {
          roles : [],
          strings: getAppState()
        };

        this.fetchRoles();
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

    deleteRole(rows){
      var del = [];
      for(var i=0; i<rows.length; i++){
        var row = rows[i];
        del.push(this.state.roles[row-1].role);
      }

      console.log(del);
    }

    fetchRoles(){
        window.payt_session.call('payt.auth.get_roles',{callback: function (res){
            var tmp_roles = [];
            Object.keys(res).forEach(function(k){
                var id = k;
                var role = res[k];

                var tmp = {
                  id: id,
                  role: role.role,
                  count: role.count
                };
              
                tmp_roles.push(tmp);
            });

            this.setState({roles: tmp_roles});
        }.bind(this),
            exchange: 'auth'
        });
    }

    addRole(id,role){
      window.payt_session.call('payt.auth.insert_role',{args: [id,role], callback: function (res){
          if(res)
            this.fetchRoles();
      }.bind(this),
        exchange: 'auth'
      });

      $('#exampleModal').modal('hide');
      $("#formAddRole").trigger('reset');
    }

    openModal(){

        var content = <RoleForm action={this.addRole.bind(this)}/>;

        render(<Modal title={this.state.strings.RolesTable.modalTitle} modalContent={content} />,document.getElementById('modalContainer'));
        $('#exampleModal').modal({
          keyboard: false
        });
    }

    createCustomDeleteButton(onClick){
      return (
        <DeleteButton btnText={this.state.strings.RolesTable.btnDelete} btnContextual='btn-danger'/>
      );
    }

    afterSaveCell(row, cellName, cellValue) {
      // if you dont want to save this editing, just return false to cancel it.
      console.log('Row edited: ' + row + ', Cell edited: ' + cellName + ', New cell value: ' + cellValue);
    }

    render() {
        const cellEdit = {
          mode: 'click', // click cell to edit
          afterSaveCell: this.afterSaveCell,
          blurToSave: true
        };

        const selectRow = {
          mode: 'checkbox',  // single select
        };

        const options = {
          deleteBtn: this.createCustomDeleteButton.bind(this),
          onDeleteRow: this.deleteRole.bind(this)
        };

        var tooltip = {
          'data-original-title': this.state.strings.RolesTable.tooltipText,
          'data-container': "td",
          'data-toggle': "tooltip",
          'data-placement': "bottom",
          'data-trigger': "hover",
        }

        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.RolesTable.title}</h3>
              </div>
              <div className="box-body">
                <BootstrapTable data={this.state.roles} striped={true} hover={true} options={options} selectRow={selectRow} deleteRow cellEdit={cellEdit} ref='rolestable' search={ true } searchPlaceholder={this.state.strings.RolesTable.searchPlaceholder} pagination>
                  <TableHeaderColumn dataField="id" hidden={true} isKey={true} dataAlign="center" searchable={false}>ID</TableHeaderColumn>
                  <TableHeaderColumn dataField="role" dataAlign="center" tdAttr={tooltip} dataSort={true}>{this.state.strings.RolesTable.role}</TableHeaderColumn>
                  <TableHeaderColumn dataField="count" dataAlign="center" editable={false} searchable={false} dataSort={true}>{this.state.strings.RolesTable.nUsers}</TableHeaderColumn>
                </BootstrapTable>
                <div  style={{paddingTop:10}}>
                  <button className="btn btn-success pull-right" type="submit" onClick={this.openModal.bind(this)}>{this.state.strings.RolesTable.add}</button>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = RolesTable;