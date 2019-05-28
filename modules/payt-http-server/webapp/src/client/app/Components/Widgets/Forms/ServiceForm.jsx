import React from 'react';
import { Form, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class ServiceForm extends React.Component{
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.handleKeyChange = this.handleKeyChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);

        this.state = {
            strings: getAppState(), 
            name: '',
            key: '',
        };
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

    handleNameChange(evt){
        this.setState({ name: evt.target.value });
    }

    handleKeyChange(evt){
        this.setState({ key: evt.target.value });
    }

    add() {
        let { name, key } = this.state;
        this.props.action(name, key);
        $('#exampleModal').modal('hide');
        $("#formServices").trigger('reset');
    }

    render() {
        return(
            <Form id="formServices" ref="form" horizontal>
                <div className="box-body">
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>{this.state.strings.ServiceForm.name}</Col>
                        <Col sm={6}>
                            <FormControl    
                                onChange={(e) => this.handleNameChange(e)} 
                                type="text" 
                                value={this.state.name} 
                                placeholder={this.state.strings.ServiceForm.name}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>{this.state.strings.ServiceForm.key}</Col>
                        <Col sm={6}>
                            <FormControl    
                                onChange={(e) => this.handleKeyChange(e)} 
                                type="text" 
                                value={this.state.key} 
                                placeholder={this.state.strings.ServiceForm.key}
                            />
                        </Col>
                    </FormGroup>
                </div>
                <div className="box-footer" style={{textAlign:'right'}}>
                    <a onClick={this.add.bind(this)} className="btn btn-success" style={{cursor: 'pointer'}}>{this.state.strings.ServiceForm.submit}</a>
                </div>
            </Form>
        );
    }
}

module.exports = ServiceForm;