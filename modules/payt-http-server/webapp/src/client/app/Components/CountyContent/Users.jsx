import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import CardForm from '../Widgets/Forms/CardForm.jsx';
import Modal from '../Widgets/Modal.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class Users extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            strings: getAppState(),
            users: [],
            modal: null,
            currentSearchText: '',
            sizePerPage: 10,
            currentPage: 1,
            dataTotalSize: 0,
        };
  
        this._onChange = this._onChange.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.cardsFormatter = this.cardsFormatter.bind(this);
        this.statusFormatter = this.statusFormatter.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onSizePerPageList = this.onSizePerPageList.bind(this);
    }

    componentDidMount(){
        TranslationsStore.addChangeListener(this._onChange);
        this.fetchUsers();
    }

    // Unbind change listener
    componentWillUnmount() {
        TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({strings:getAppState()});
    }

    associateCard(producer_id, card_ids){
        console.log('producer_id', producer_id);
        console.log('ids', card_ids);

        window.payt_session.call('payt.'+window.county+'.db.private.edit_producer_cards', {
            args: [producer_id, card_ids],
            callback: function (res){
                console.log(res);
		    }.bind(this),
            exchange: window.county
        });

        $('#exampleModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        this.setState({modal: null});
    }

    addCard(producer_id){
        var content = <CardForm action={this.associateCard.bind(this)} producer_id={producer_id}/>;
        var modal = <Modal title={this.state.strings.Users.modalTitle} modalContent={content} />
        this.setState({modal: modal});
        setTimeout(() => {
            $('#exampleModal').modal();
            $('#exampleModal').on('hidden.bs.modal', function (e) {
                this.setState({modal: null});
            }.bind(this))
        }, 150);
    }

    cardsFormatter(cell, row, enumObject, rowIndex) {
        return (  
            <div onClick={() => this.addCard(row.id)} style={{ cursor: 'pointer' }}>
                <i className="fas fa-id-card"></i> <u>{this.state.strings.Users.checkCards}</u> 
            </div>
        );
    }

    statusFormatter(cell, row, enumObject, rowIndex) {
        return this.state.strings.Global.status[cell];
    }

    setDataTotalSize(size){
        this.setState({ dataTotalSize: size });
    }

    fetchUsers(){
        var tmp = [];

        window.payt_session.call('payt.'+window.county+'.db.private.get_producers', { 
            args: [this.state.currentPage,this.state.sizePerPage,this.state.currentSearchText],
            callback: function(res) {
                console.log('producers',res);

                if(this.state.dataTotalSize != res.totalDataSize)
                    this.setDataTotalSize(res.totalDataSize);

                if(res.data != null){
                    res.data.forEach(el => {
                        let id = el.producer.p_id;
                        let name = el.name;
                        let email = el.email || 'N/D';
                        let address = el.producer.address;
                        let last_access = el.last_access;
                        let status = el.status || '---';

                        tmp.push({id: id, name: name, email: email, address: address, status: status, last_access: last_access});
                    });

                    this.setState({users: tmp});
                }
            }.bind(this),
            exchange: window.county
        });
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

    createCustomClearButton(onClick){
        return (
          <ClearSearchButton btnText={this.state.strings.UsersTable.clear}/>
        );
    }

    onSearchChange(searchText, colInfos, multiColumnSearch) {
        this.setState({ currentSearchText: searchText, currentPage: 1 }, () =>{
                console.log('Searching ', this.state.currentSearchText);
                console.log('Current Page ', this.state.currentPage);
                this.fetchUsers();
            }
        );
    }

    render() {
        const options = {
            onSearchChange: this.onSearchChange.bind(this),
            searchDelayTime: 1500,
            clearSearch: true,
            clearSearchBtn: this.createCustomClearButton.bind(this),
            sizePerPage: this.state.sizePerPage,
            onPageChange: this.onPageChange,
            sizePerPageList: [ 10, 25, 30, 50 ],
            page: this.state.currentPage,
            onSizePerPageList: this.onSizePerPageList
        };

        const fetchInfo = { dataTotalSize: this.state.dataTotalSize };

        return (
            <div className="box box-success">
                <div className="box-header">
                    <h3 className="box-title">{this.state.strings.Users.title}</h3>
                </div>
                <div className="box-body">
                    <BootstrapTable fetchInfo={fetchInfo} remote={this.remote} data={this.state.users} options={options} striped hover ref='users' search searchPlaceholder={this.state.strings.Users.searchPlaceholder} pagination>
                        <TableHeaderColumn dataField="id" hidden isKey dataAlign="center">ID</TableHeaderColumn>
                        <TableHeaderColumn dataField="name" tdStyle={ { overflow: 'scroll', textOverflow: 'inherit' } } dataAlign="center" width='200px'>{this.state.strings.Users.name}</TableHeaderColumn>
                        <TableHeaderColumn dataField="email" dataAlign="center" width='150px'>{this.state.strings.Users.mail}</TableHeaderColumn>
                        <TableHeaderColumn dataField="address" tdStyle={ { overflow: 'scroll', textOverflow: 'inherit' } } dataAlign="center" width='200px'>{this.state.strings.Users.address}</TableHeaderColumn>
                        <TableHeaderColumn dataFormat={this.cardsFormatter} dataAlign="center" width='150px'>{this.state.strings.Users.cards}</TableHeaderColumn>
                        <TableHeaderColumn dataField="last_access" dataAlign="center" width='150px'>{this.state.strings.Users.last_access}</TableHeaderColumn>
                        <TableHeaderColumn dataField="status" dataFormat={this.statusFormatter} dataAlign="center" width='100px'>{this.state.strings.Users.state}</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                {this.state.modal}
            </div>
        );
    }
}

module.exports = Users;