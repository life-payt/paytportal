import React from 'react';
import { BootstrapTable, TableHeaderColumn, ClearSearchButton } from 'react-bootstrap-table';
import { Button, ButtonToolbar } from 'react-bootstrap';
import ServiceForm from '../Forms/ServiceForm.jsx';
import Modal from '../Modal.jsx';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class ServicesTable extends React.Component {

    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.fetchServices = this.fetchServices.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.addService = this.addService.bind(this);
        this.actionsFormatter = this.actionsFormatter.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onSizePerPageList = this.onSizePerPageList.bind(this);

        this.state = {
            modal: null,
            services : [
                {
                    id: 1,
                    name: 'teste',
                    key: 'teste',
                    status: getAppState().ServicesTable.started
                },
                {
                    id: 2,
                    name: 'teste',
                    key: 'teste',
                    status: getAppState().ServicesTable.stopped
                }
            ],
            sizePerPage: 10,
            currentPage: 1,
            dataTotalSize: 0,
            currentSearchText: '',
            strings: getAppState()
        };

        this.fetchServices();
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

    setDataTotalSize(size){
        this.setState({ dataTotalSize: size });
    }

    fetchServices() {
        var tmp_services = [];

        window.payt_session.call('payt.auth.get_services',{
            args: [this.state.currentPage,this.state.sizePerPage,this.state.currentSearchText],
            callback: function (res){
              if(this.state.dataTotalSize != res.totalDataSize)
                  this.setDataTotalSize(res.totalDataSize);

              Object.keys(res.data).forEach(k => {
                    var id = k;
                    var service = res.data[k];

                    var tmp = {
                        id: id,
                        name: service.name,
                        key: service.key,
                        status: user.status ? this.state.strings.ServicesTable.started : this.state.strings.ServicesTable.stopped,
                    };

                    tmp_services.push(tmp);
              });
              this.setState({ services: tmp_services });
            }.bind(this),
            exchange: 'auth'
        });
    }

    actionsFormatter(cell, row) {
        var btn;
        switch(row.status){
            case this.state.strings.ServicesTable.stopped:
                btn = <Button bsStyle="success" bsSize="xsmall" onClick={this.handleStart}>{this.state.strings.ServicesTable.start}</Button>
                break;
            case this.state.strings.ServicesTable.started:
                btn = <Button bsStyle="warning" bsSize="xsmall" onClick={this.handleStop}>{this.state.strings.ServicesTable.stop}</Button>
                break;
            default:
                btn = ''
                break;
        }

        return  <ButtonToolbar bsClass="btn-toolbar" style={{display: "flex", justifyContent: "center"}}>
                    {btn}
                    <Button bsStyle="danger" bsSize="xsmall" onClick={this.removeService.bind(this,row)}>{this.state.strings.ServicesTable.remove}</Button>
                </ButtonToolbar>;
    }

    addService(name, key){
        console.log(`Creating service: ${name} with key: ${key}`);
    }

    handleStart(){
        console.log('Starting');
    }

    handleStop(){
        console.log('Stopping');
    }

    removeService(row){
        console.log(`Service: ${row.name} with id: ${row.id} removed successfuly`);
    }

    openModal(){
        var content = <ServiceForm action={this.addService}/>;
        var modal = <Modal title={this.state.strings.ServicesTable.modalTitle} modalContent={content} />;
        this.setState({modal: modal});

        setTimeout(() => {
            $('#exampleModal').modal();
            $('#exampleModal').on('hidden.bs.modal', function (e) {
                this.setState({modal: null});
            }.bind(this))
        }, 150);
    }

    createCustomClearButton(onClick){
        return (
          <ClearSearchButton btnText={this.state.strings.ServicesTable.clear}/>
        );
    }

    remote(remoteObj) {
        remoteObj.pagination = true;
        remoteObj.search = true;
        return remoteObj;
    }

    onPageChange(page, sizePerPage) {
        this.setState({ currentPage: page }, () => {
            this.fetchServices();
        });
    }
  
    onSizePerPageList(sizePerPage) {
        this.setState({ sizePerPage: sizePerPage }, () => {
            this.fetchServices();
        });
    }

    onSearchChange(searchText, colInfos, multiColumnSearch) {
        this.setState({ currentSearchText: searchText, currentPage: 1 }, () => {
            console.log('Searching ', this.state.currentSearchText);
            console.log('Current Page ', this.state.currentPage);
            this.fetchServices();
        });
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

        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.ServicesTable.title}</h3>
              </div>
              <div className="box-body">
                <BootstrapTable fetchInfo={fetchInfo} remote={this.remote} data={this.state.services} striped hover options={options} ref='ServicesTable' search searchPlaceholder={this.state.strings.ServicesTable.searchPlaceholder} pagination>
                  <TableHeaderColumn dataField="id" hidden isKey dataAlign="center" width='150px'>ID</TableHeaderColumn>
                  <TableHeaderColumn dataField="name" dataAlign="center" width='150px'>{this.state.strings.ServicesTable.name}</TableHeaderColumn>
                  <TableHeaderColumn dataField="key" dataAlign="center" width='150px'>{this.state.strings.ServicesTable.key}</TableHeaderColumn>
                  <TableHeaderColumn dataField="status" dataAlign="center" width='150px'>{this.state.strings.ServicesTable.status}</TableHeaderColumn>
                  <TableHeaderColumn dataFormat={this.actionsFormatter} dataAlign="center" width='100px' searchable={ false }>{this.state.strings.ServicesTable.actions}</TableHeaderColumn>
                </BootstrapTable>
                <div className="pull-right" style={{paddingTop:10}}>
                  <button className="btn btn-success" type="submit" onClick={this.openModal.bind(this)}>{this.state.strings.ServicesTable.add}</button>
                </div>
              </div>
              {this.state.modal}
            </div>
        );
    }
}

module.exports = ServicesTable;