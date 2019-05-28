import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class RoleForm extends React.Component{
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {strings:getAppState()};
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

    add() {
        var id = this.refs.inputId.value;
        var role = this.refs.inputRole.value;
        this.props.action(id,role);
    }

    render() {

        return(
            <form className="form-horizontal" id="formAddRole">
              <div className="box-body">
                <div className="form-group">
                  <label htmlFor="inputId" className="col-sm-4 control-label">ID</label>

                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="inputId" placeholder='ID' ref="inputId"></input>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputRole" className="col-sm-4 control-label">{this.state.strings.RoleForm.role}</label>

                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="inputRole" placeholder={this.state.strings.RoleForm.role} ref="inputRole"></input>
                  </div>
                </div>
              </div>
              <div className="box-footer" style={{textAlign:'right'}}>
                <a href="#" onClick={this.add.bind(this)} className="btn btn-success">{this.state.strings.RoleForm.add}</a>
              </div>
            </form>
        );
    }
}

module.exports = RoleForm;