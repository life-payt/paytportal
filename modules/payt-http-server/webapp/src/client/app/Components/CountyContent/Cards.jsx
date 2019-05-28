import React from 'react';
import {render} from 'react-dom';

import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import HistoryCardTable from '../Widgets/Tables/HistoryCardTable.jsx';
import IDCardForm from '../Widgets/Forms/IDCardForm.jsx';
import OwnerProfileCard from '../Widgets/OwnerProfileCard.jsx';
import Modal from '../Widgets/Modal.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class Cards extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            strings: getAppState(),
            cards: [],
            expanding: [],
            modal: null,
            sizePerPage: 10,
            currentPage: 1,
            dataTotalSize: 0,
        };
  
        this._onChange = this._onChange.bind(this);
        this.fetchCards = this.fetchCards.bind(this);
        this.ownerFormatter = this.ownerFormatter.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onSizePerPageList = this.onSizePerPageList.bind(this);
    }

    componentDidMount(){
        TranslationsStore.addChangeListener(this._onChange);
        this.fetchCards();
    }

    // Unbind change listener
    componentWillUnmount() {
        TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({strings:getAppState()});
    }

    createCard(card_id){
        window.payt_session.call('payt.'+window.county+'.db.private.insert_card', {
            args: [card_id],
            callback: function (res){
                this.fetchCards();
		    }.bind(this),
            exchange: window.county
        });

        $('#exampleModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        this.setState({modal: null});
    }

    addCard(){
        var content = <IDCardForm action={this.createCard.bind(this)}/>;
        var modal = <Modal title={this.state.strings.Cards.addCardModalTitle} modalContent={content} />
        this.setState({modal: modal});
        setTimeout(() => {
            $('#exampleModal').modal();
            $('#exampleModal').on('hidden.bs.modal', function (e) {
                this.setState({modal: null});
            }.bind(this))
        }, 150);
    }

    setDataTotalSize(size){
        this.setState({ dataTotalSize: size });
    }

    fetchCards(){
        var tmp = [];
        
        window.payt_session.call('payt.'+window.county+'.db.private.get_all_id_cards', { 
            args: [this.state.currentPage,this.state.sizePerPage],
            callback: function(res) {
                if(this.state.dataTotalSize != res.totalDataSize)
                    this.setDataTotalSize(res.totalDataSize);

                if(res.data != null){
                    res.data.forEach((el,idx) => {
                        let id = idx;
                        let card = el.card;
                        let owner = el.owner;

                        tmp.push({id: id, card: card, owner: owner});
                    });

                    this.setState({cards: tmp});
                }

            }.bind(this),
            exchange: window.county
        });
    }

    deleteCard(rows){
        rows.forEach(id => {
            window.payt_session.call('payt.'+ window.county +'.db.private.delete_idcard',{
                args: [this.state.cards[id].card],
                callback: function(res){
                    this.fetchCards();
                }.bind(this),
                exchange: window.county
            });
        });
    }

    createCustomDeleteButton(onClick){
        return (
          <DeleteButton btnText={this.state.strings.Cards.btnDelete} btnContextual='btn-danger'/>
        );
    }

    ownerFormatter(cell, row, enumObject, rowIndex) {
        if(!_.isEmpty(this.state.cards[row.id].owner)){
            return (  
                <div onClick={() => this.showOwner(row.id)} style={{ cursor: 'pointer' }}>
                    <i className="fas fa-id-card"></i> <u>{this.state.strings.Cards.showOwner}</u> 
                </div>
            );
        }
        else
            return this.state.strings.Cards.noOwner;
    }

    showOwner(idx){
        let owner = this.state.cards[idx].owner;
        var content = <OwnerProfileCard owner={owner}/>;
        var modal = <Modal title={this.state.strings.Cards.showOwnerModalTitle} modalContent={content} />
        this.setState({modal: modal});
        setTimeout(() => {
            $('#exampleModal').modal();
            $('#exampleModal').on('hidden.bs.modal', function (e) {
                this.setState({modal: null});
            }.bind(this))
        }, 150);
    }

    remote(remoteObj) {
        remoteObj.pagination = true;
        return remoteObj;
    }

    onPageChange(page, sizePerPage) {
        this.setState({ currentPage: page });
        setTimeout(() => {
            this.fetchCards();
        }, 100);
    }

    onSizePerPageList(sizePerPage) {
        this.setState({ sizePerPage: sizePerPage });
        setTimeout(() => {
            this.fetchCards();
        }, 100);
    }

    isExpandableRow(row) {
        return true;
    }
      
    expandComponent(row) {
        return (
            <HistoryCardTable id={row.card}/>
        );
    }
      
    expandColumnComponent({ isExpandableRow, isExpanded }) {
        let content = '';
    
        if (isExpandableRow) {
            content = (isExpanded ? <i className='fa fa-times-circle'/> : <i className='fa fa-clock'/> );
        } else {
            content = ' ';
        }
        return content;
    }

    render() {
        const selectRow = { mode: 'checkbox', clickToExpand: true };

        const options = {
            deleteBtn: this.createCustomDeleteButton.bind(this),
            onDeleteRow: this.deleteCard.bind(this),
            sizePerPage: this.state.sizePerPage,
            onPageChange: this.onPageChange,
            sizePerPageList: [ 10, 25, 30, 50 ],
            page: this.state.currentPage,
            onSizePerPageList: this.onSizePerPageList,
        };

        var expandOptions = { 
            expandColumnVisible: true,
            expandColumnComponent: this.expandColumnComponent,
            expandBy: 'column',
            expanding: this.state.expanding
        };

        const fetchInfo = { dataTotalSize: this.state.dataTotalSize };

        return (
            <div className="box box-success">
                <div className="box-header">
                    <h3 className="box-title">{this.state.strings.Cards.title}</h3>
                </div>
                <div className="box-body">
                    <BootstrapTable expandableRow={this.isExpandableRow} expandComponent={this.expandComponent.bind(this)} expandColumnOptions={expandOptions} fetchInfo={fetchInfo} remote={this.remote} data={this.state.cards} options={options} striped hover selectRow={selectRow} deleteRow ref='cards' pagination>
                        <TableHeaderColumn dataField="id" hidden isKey dataAlign="center">ID</TableHeaderColumn>
                        <TableHeaderColumn expandable={ false } dataField="card" dataAlign="center" >{this.state.strings.Cards.nrCard}</TableHeaderColumn>
                        <TableHeaderColumn expandable={ false } dataFormat={this.ownerFormatter} dataAlign="center" >{this.state.strings.Cards.cardOwner}</TableHeaderColumn>
                    </BootstrapTable>
                    <div className="pull-right" style={{paddingTop:10}}>
                        <button className="btn btn-success" type="submit" onClick={this.addCard.bind(this)}>{this.state.strings.Cards.addCardModalTitle}</button>
                    </div>
                </div>
                {this.state.modal}
            </div>
        );
    }
}

module.exports = Cards;