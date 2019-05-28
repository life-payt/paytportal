import React from 'react';
import {render} from 'react-dom';

import Widget from '../Widget.jsx';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class SimulForm extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        indContainersNr: [0,0,0,0],
        indFreqRec:0,
        plasContainersNr: [0,0,0,0],
        plasFreqRec:0,
        vidContainersNr: [0,0,0,0],
        vidFreqRec:0,
        papContainersNr: [0,0,0,0],
        papFreqRec:0,
        strings: getAppState()
      };

      this._onChange = this._onChange.bind(this);

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleIndInputChange = this.handleIndInputChange.bind(this);
      this.handlePlasInputChange = this.handlePlasInputChange.bind(this);
      this.handleVidInputChange = this.handleVidInputChange.bind(this);
      this.handlePapInputChange = this.handlePapInputChange.bind(this);
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

    handleInputChange(event) {
      console.log('ind: ' + this.state.indContainersNr);
      console.log('plas: ' + this.state.plasContainersNr);
      console.log('vid: ' + this.state.vidContainersNr);
      console.log('pap: ' + this.state.papContainersNr);

      var value = (Math.random() * (120 - 2) + 80).toFixed(2);
      var result = <Widget enable={false} value={ value + '€/mês'} text='Valor simulado, para mais informações contacte xxxxxxxx' icon='fa fa-calculator' color='bg-green' />

      render(result, document.getElementById('simulResult'));
    }

    handleIndInputChange(event) {
      const value = event.target.value;
      const index = Number(event.target.name);
      const tmp = this.state.indContainersNr;
      tmp[index] = value;
      
      this.setState({
        indContainersNr: tmp
      });
    }

    handlePlasInputChange(event) {
      const value = event.target.value;
      const index = Number(event.target.name);
      const tmp = this.state.plasContainersNr;
      tmp[index] = value;

      this.setState({
        plasContainersNr: tmp
      });
    }

    handleVidInputChange(event) {
      const value = event.target.value;
      const index = Number(event.target.name);
      const tmp = this.state.vidContainersNr;
      tmp[index] = value;

      this.setState({
        vidContainersNr: tmp
      });
    }

    handlePapInputChange(event) {
      const value = event.target.value;
      const index = Number(event.target.name);
      const tmp = this.state.papContainersNr;
      tmp[index] = value;

      this.setState({
        papContainersNr: tmp
      });
    }

    render() {

        return(
          <div className="box box-success">
            <div className="box-header with-border">
              <h3 className="box-title">{this.state.strings.SimulForm.title}</h3>
            </div>
            <form className="form-horizontal">
              <div className="box-body">
                <div className="form-group">
                  <label className="col-sm-2 col-sm-offset-2 control-label" style={{textAlign:'center'}}>{this.state.strings.SimulForm.indif}</label>
                  <label className="col-sm-2 control-label" style={{textAlign:'center'}}>{this.state.strings.SimulForm.plast}</label>
                  <label className="col-sm-2 control-label" style={{textAlign:'center'}}>{this.state.strings.SimulForm.glass}</label>
                  <label className="col-sm-2 control-label" style={{textAlign:'center'}}>{this.state.strings.SimulForm.pap_cart}</label>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">{this.state.strings.SimulForm.c140l}</label>

                  <div className="col-sm-2">
                    <input type="number" name="0" value={this.state.indContainersNr[0]} onChange={this.handleIndInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="0" value={this.state.plasContainersNr[0]} onChange={this.handlePlasInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="0" value={this.state.vidContainersNr[0]} onChange={this.handleVidInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="0" value={this.state.papContainersNr[0]} onChange={this.handlePapInputChange} className="form-control"></input>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">{this.state.strings.SimulForm.c240l}</label>

                  <div className="col-sm-2">
                    <input type="number" name="1" value={this.state.indContainersNr[1]} onChange={this.handleIndInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="1" value={this.state.plasContainersNr[1]} onChange={this.handlePlasInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="1" value={this.state.vidContainersNr[1]} onChange={this.handleVidInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="1" value={this.state.papContainersNr[1]} onChange={this.handlePapInputChange} className="form-control"></input>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">{this.state.strings.SimulForm.c340l}</label>

                  <div className="col-sm-2">
                    <input type="number" name="2" value={this.state.indContainersNr[2]} onChange={this.handleIndInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="2" value={this.state.plasContainersNr[2]} onChange={this.handlePlasInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="2" value={this.state.vidContainersNr[2]} onChange={this.handleVidInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="2" value={this.state.papContainersNr[2]} onChange={this.handlePapInputChange} className="form-control"></input>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">{this.state.strings.SimulForm.c1000l}</label>

                  <div className="col-sm-2">
                    <input type="number" name="3" value={this.state.indContainersNr[3]} onChange={this.handleIndInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="3" value={this.state.plasContainersNr[3]} onChange={this.handlePlasInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="3" value={this.state.vidContainersNr[3]} onChange={this.handleVidInputChange} className="form-control"></input>
                  </div>
                  <div className="col-sm-2">
                    <input type="number" name="3" value={this.state.papContainersNr[3]} onChange={this.handlePapInputChange} className="form-control"></input>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-10" style={{textAlign:'right'}}>
                    <a href="#" onClick={this.handleInputChange} className="btn btn-default">{this.state.strings.SimulForm.calc}</a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
    }
}

module.exports = SimulForm;