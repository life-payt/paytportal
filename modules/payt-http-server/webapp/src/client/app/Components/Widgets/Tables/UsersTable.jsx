import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn, DeleteButton, ClearSearchButton } from 'react-bootstrap-table';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import UserForm from '../Forms/UserForm.jsx';
import Modal from '../Modal.jsx';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class UsersTable extends React.Component {

    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.formatMasterKey = this.formatMasterKey.bind(this);
        this.statusFormatter = this.statusFormatter.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onSizePerPageList = this.onSizePerPageList.bind(this);

        this.state = {
          modal: null,
          users : [],
          sizePerPage: 10,
          currentPage: 1,
          dataTotalSize: 0,
          currentSearchText: '',
          strings: getAppState()
        };

        this.fetchUsers();
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

    formatCounties(counties) {
      if(typeof counties != "string"){
        return counties.reduce((accumulator, currentValue) => accumulator + ', ' + currentValue);
      }
      else
        return counties;
    }

    showMasterKey(id,username) {
        window.payt_session.call('payt.auth.get_masterkey',{
            args: [id],
            callback: function (res){
                var content = <div style={{textAlign: 'center'}}><h3><strong>{username}:</strong> {res} </h3></div>;
                var modal = <Modal title={this.state.strings.UsersTable.master} modalContent={content} />;
                this.setState({modal: modal});

                setTimeout(() => {
                    $('#exampleModal').modal();
                    $('#exampleModal').on('hidden.bs.modal', function (e) {
                        this.setState({modal: null});
                    }.bind(this))
                }, 150);

            }.bind(this),
            exchange: 'auth'
        });
    }

    formatMasterKey(cell, row, enumObject, rowIndex) {
      return (  
          <div onClick={() => this.showMasterKey(row.id, row.username)} style={{ cursor: 'pointer' }}>
              <i className="fas fa-key"></i> <u>{this.state.strings.UsersTable.checkMasterKey}</u> 
          </div>
      );
    }

    statusFormatter(cell, row, enumObject, rowIndex) {
        return this.state.strings.Global.status[cell];
    }

    setDataTotalSize(size){
        this.setState({ dataTotalSize: size });
    }

    fetchUsers() {
        var tmp_users = [];

        window.payt_session.call('payt.auth.get_users',{
            args: [this.state.currentPage,this.state.sizePerPage,this.state.currentSearchText],
            callback: function (res){
              if(this.state.dataTotalSize != res.totalDataSize)
                  this.setDataTotalSize(res.totalDataSize);

              Object.keys(res.data).forEach(k => {
                  var id = k;
                  var user = res.data[k];

                  var tmp = {
                    id: id,
                    username: user.username,
                    email: user.email || '---',
                    counties: user.counties.length > 0 ? user.counties : '---',
                    role: user.role,
                    last_access: user.last_access,
                    status: user.status || '---'
                  };
                  tmp_users.push(tmp);
              });
              this.setState({ users: tmp_users });
            }.bind(this),
            exchange: 'auth'
        });
    }

    addUser(username,email,role,county){
        window.payt_session.call('payt.auth.insert_user',{args: [username,email,role,county], callback: function (res){
            this.fetchUsers();
        }.bind(this),
            exchange: 'auth'
        });
    }

    deleteUser(rows){
      rows.forEach(row => {
          var id = parseInt(row);
          window.payt_session.call('payt.auth.delete_user',{
              args: [id],
              callback: function(res){
                  if(res)
                    console.log('User_id ' + id + ' deleted successfully');
              }.bind(this),
              exchange: 'auth'
          });
      });
    }

    openModal(){
        var content = <UserForm action={this.addUser.bind(this)}/>;
        render(<Modal title={this.state.strings.UsersTable.modalTitle} modalContent={content} />,document.getElementById('modalContainer'));
        $('#exampleModal').modal({
          keyboard: false
        });
    }

    createCustomDeleteButton(onClick){
      return (
        <DeleteButton btnText={this.state.strings.UsersTable.btnDelete} btnContextual='btn-danger'/>
      );
    }

    createCustomClearButton(onClick){
        return (
          <ClearSearchButton btnText={this.state.strings.UsersTable.clear}/>
        );
    }

    remote(remoteObj) {
      remoteObj.pagination = true;
      remoteObj.search = true;
      return remoteObj;
    }

    onPageChange(page, sizePerPage) {
      this.setState({ currentPage: page }, () => {
          this.fetchUsers();
      });
    }
  
    onSizePerPageList(sizePerPage) {
      this.setState({ sizePerPage: sizePerPage }, () => {
          this.fetchUsers();
      });
    }

    onSearchChange(searchText, colInfos, multiColumnSearch) {
        this.setState({ currentSearchText: searchText, currentPage: 1 }, () => {
            console.log('Searching ', this.state.currentSearchText);
            console.log('Current Page ', this.state.currentPage);
            this.fetchUsers();
        });
    }

    render() {
        const selectRow = { mode: 'checkbox' };

        const options = {
          onSearchChange: this.onSearchChange.bind(this),
          searchDelayTime: 1500,
          clearSearch: true,
          clearSearchBtn: this.createCustomClearButton.bind(this),
          deleteBtn: this.createCustomDeleteButton.bind(this),
          onDeleteRow: this.deleteUser.bind(this),
          sizePerPage: this.state.sizePerPage,
          onPageChange: this.onPageChange,
          sizePerPageList: [ 10, 25, 30, 50 ],
          page: this.state.currentPage,
          onSizePerPageList: this.onSizePerPageList
        };

        const fetchInfo = { dataTotalSize: this.state.dataTotalSize };

        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.UsersTable.title}</h3>
              </div>
              <div className="box-body">
                <BootstrapTable fetchInfo={fetchInfo} remote={this.remote} data={this.state.users} striped hover options={options} selectRow={selectRow} deleteRow ref='userstable' search searchPlaceholder={this.state.strings.UsersTable.searchPlaceholder} pagination>
                  <TableHeaderColumn dataField="id" hidden isKey dataAlign="center" width='150px'>ID</TableHeaderColumn>
                  <TableHeaderColumn dataField="username" dataAlign="center" width='150px'>{this.state.strings.UsersTable.username}</TableHeaderColumn>
                  <TableHeaderColumn dataFormat={this.formatMasterKey} dataAlign="center" width='150px'>{this.state.strings.UsersTable.master}</TableHeaderColumn>
                  <TableHeaderColumn dataField="email" dataAlign="center" width='150px'>E-Mail</TableHeaderColumn>
                  <TableHeaderColumn dataField="counties" dataAlign="center" dataFormat={this.formatCounties} width='100px'>{this.state.strings.UsersTable.county}</TableHeaderColumn>
                  <TableHeaderColumn dataField="role" dataAlign="center" width='100px'>{this.state.strings.UsersTable.role}</TableHeaderColumn>
                  <TableHeaderColumn dataField="last_access" dataAlign="center" width='150px'>{this.state.strings.UsersTable.last_access}</TableHeaderColumn>
                  <TableHeaderColumn dataField="status" dataFormat={this.statusFormatter} dataAlign="center" width='100px' searchable={ false }>{this.state.strings.UsersTable.status}</TableHeaderColumn>
                </BootstrapTable>
                <div className="pull-right" style={{paddingTop:10}}>
                  <button className="btn btn-success" type="submit" onClick={this.openModal.bind(this)}>{this.state.strings.UsersTable.add}</button>
                </div>
              </div>
              {this.state.modal}
            </div>
        );
    }
}

module.exports = UsersTable;