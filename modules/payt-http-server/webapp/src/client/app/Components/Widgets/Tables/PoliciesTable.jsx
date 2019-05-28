import React from 'react';
import { BootstrapTable, TableHeaderColumn, ClearSearchButton } from 'react-bootstrap-table';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class PoliciesTable extends React.Component {

    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.fetchPolicies = this.fetchPolicies.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onSizePerPageList = this.onSizePerPageList.bind(this);
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);

        this.state = {
            policies : [],
            sizePerPage: 10,
            currentPage: 1,
            dataTotalSize: 0,
            currentSearchText: '',
            filter: '',
            strings: getAppState()
        };

        this.fetchPolicies();
    }

    // Listen for changes
    componentDidMount() {
      TranslationsStore.addChangeListener(this._onChange);
    }

    // Unbind change listener
    componentWillUnmount() {
      TranslationsStore.removeChangeListener(this._onChange);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.filter != this.state.filter)
            this.setState({filter: nextProps.filter}, () => this.fetchPolicies());
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    setDataTotalSize(size){
        this.setState({ dataTotalSize: size });
    }

    fetchPolicies() {
        var tmp_policies = [];

        window.payt_session.call('payt.auth.get_policies',{
            args: [this.state.currentPage,this.state.sizePerPage,this.state.filter],
            callback: function (res){
              if(this.state.dataTotalSize != res.totalDataSize)
                  this.setDataTotalSize(res.totalDataSize);

              Object.keys(res.data).forEach(k => {
                    var id = k;
                    var policy = res.data[k];

                    var tmp = {
                        id: id,
                        field: policy.field,
                        policy: policy.permission,
                    };

                    tmp_policies.push(tmp);
              });
              this.setState({ policies: tmp_policies });
            }.bind(this),
            exchange: 'auth'
        });
    }

    createCustomClearButton(onClick){
        return (
          <ClearSearchButton btnText={this.state.strings.PoliciesTable.clear}/>
        );
    }

    remote(remoteObj) {
        remoteObj.pagination = true;
        remoteObj.search = true;
        return remoteObj;
    }

    onPageChange(page, sizePerPage) {
        this.setState({ currentPage: page }, () => {
            this.fetchPolicies();
        });
    }
  
    onSizePerPageList(sizePerPage) {
        this.setState({ sizePerPage: sizePerPage }, () => {
            this.fetchPolicies();
        });
    }

    onSearchChange(searchText, colInfos, multiColumnSearch) {
        this.setState({ currentSearchText: searchText, currentPage: 1 }, () => {
            console.log('Searching ', this.state.currentSearchText);
            console.log('Current Page ', this.state.currentPage);
            this.fetchPolicies();
        });
    }

    onAfterSaveCell(row, cellName, cellValue) {
        console.log(`Saving policy ${row.id} with new value: ${cellValue}`);
        window.payt_session.call('payt.auth.alter_policy',{
            args: [row.id,cellValue,this.state.filter],
            callback: function (res){
                this.fetchPolicies();
            }.bind(this),
            exchange: 'auth'
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

        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
        };

        const fetchInfo = { dataTotalSize: this.state.dataTotalSize };

        const policyTypes = ['public', 'owner', 'restricted', 'internal'];

        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.filter.length > 0 ? this.state.strings.PoliciesTable.title + ' - ' + this.state.filter : this.state.strings.PoliciesTable.title}</h3>
              </div>
              <div className="box-body">
                <BootstrapTable fetchInfo={fetchInfo} remote={this.remote} data={this.state.policies} cellEdit={ cellEditProp } striped hover options={options} ref='PoliciesTable' search searchPlaceholder={this.state.strings.PoliciesTable.searchPlaceholder} pagination>
                  <TableHeaderColumn dataField="id" hidden isKey dataAlign="center" width='150px'>ID</TableHeaderColumn>
                  <TableHeaderColumn dataField="field" dataAlign="center" width='150px' editable={false}>{this.state.strings.PoliciesTable.field}</TableHeaderColumn>
                  <TableHeaderColumn dataField="policy" editable={ { type: 'select', options: { values: policyTypes } } }dataAlign="center" width='150px'>{this.state.strings.PoliciesTable.policy}</TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
        );
    }
}

module.exports = PoliciesTable;