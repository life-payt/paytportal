import React from 'react';
import {render} from 'react-dom';
import { Form, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class IDCardForm extends React.Component{
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);

        this.state = {
            strings: getAppState(), 
            cardId: '',
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

    handleCardChange(evt){
        this.setState({ cardId: evt.target.value });
    }

    handleAddCard() {
        this.setState({
            cards: this.state.cards.concat([{ id: '' }])
        });
    }

    add() {
        let { cardId } = this.state;
        this.props.action(cardId);
    }

    render() {
        return(
            <Form id="formIDCards" ref="form" horizontal>
                <div className="box-body">
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>{this.state.strings.IDCardForm.cardId}</Col>
                        <Col sm={6}>
                            <FormControl    
                                onChange={(e) => this.handleCardChange(e)} 
                                type="text" 
                                value={this.state.cardId} 
                                placeholder={`${this.state.strings.IDCardForm.card} ID`}
                            />
                        </Col>
                    </FormGroup>
                </div>
                <div className="box-footer" style={{textAlign:'right'}}>
                    <a onClick={this.add.bind(this)} className="btn btn-success" style={{cursor: 'pointer'}}>{this.state.strings.IDCardForm.submit}</a>
                </div>
            </Form>
        );
    }
}

module.exports = IDCardForm;