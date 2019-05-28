import React from 'react';
import {render} from 'react-dom';
import { Form, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class CardForm extends React.Component{
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.fetchCards = this.fetchCards.bind(this);
        this.setCardIds = this.setCardIds.bind(this);

        this.state = {
            strings: getAppState(), 
            cards: [{id: ''}],
        };
    }

    // Listen for changes
    componentDidMount() {
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

    fetchCards(){
        window.payt_session.call('payt.'+window.county+'.db.private.get_producer_cards', {
            args: [this.props.producer_id],
            callback: function (res){
                console.log('res cards', res);
                if(res != null && res.length > 0)
                    this.setCardIds(res);
		    }.bind(this),
            exchange: window.county
        });
    }

    setCardIds(val){
        var tmp = [];
        
        val.forEach(id => {
            tmp.push({id: id});
        });

        this.setState({cards: tmp});
    }

    handleCardChange(idx,evt){
        const newCards = this.state.cards.map((card, sidx) => {
            if (idx !== sidx) return card;
            return { id: evt.target.value };
        });
    
        this.setState({ cards: newCards });
    }

    handleAddCard() {
        this.setState({
            cards: this.state.cards.concat([{ id: '' }])
        });
    }

    handleRemoveCard(idx) {
        this.setState({
            cards: this.state.cards.filter((s, sidx) => idx !== sidx)
        });
    }

    add() {
        let cardIds = [];

        this.state.cards.forEach(card => {
            if(card.id.length)
                cardIds.push(card.id);
        });

        this.props.action(this.props.producer_id,cardIds);
    }

    render() {
        return(
            <Form id="formCards" ref="form" horizontal>
                <div className="box-body">
                    {this.state.cards.map((card, idx) => (
                        <FormGroup key={idx}>
                            <Col componentClass={ControlLabel} sm={4}>{this.state.strings.CardForm.cardId}</Col>
                            <Col sm={6}>
                                <FormControl    
                                    onChange={(e) => this.handleCardChange(idx,e)} 
                                    type="text" 
                                    value={card.id} 
                                    placeholder={`${this.state.strings.CardForm.card} #${idx+1} ID`}
                                />
                            </Col>
                            <Col sm={2}>
                                <Button bsStyle="danger" onClick={() => this.handleRemoveCard(idx)}>
                                    <span className="glyphicon glyphicon-remove"></span>
                                </Button>
                            </Col> 
                        </FormGroup>
                    ))}
                    <hr style={{marginLeft: '30%', marginRight: '30%'}}/>
                    <FormGroup>
                        <Col smOffset={2} sm={8}>
                            <Button onClick={this.handleAddCard.bind(this)} block>
                                {this.state.strings.CardForm.addCard}
                            </Button>
                        </Col>
                    </FormGroup>
                </div>
                <div className="box-footer" style={{textAlign:'right'}}>
                    <a onClick={this.add.bind(this)} className="btn btn-success" style={{cursor: 'pointer'}}>{this.state.strings.CardForm.submit}</a>
                </div>
            </Form>
        );
    }
}

module.exports = CardForm;