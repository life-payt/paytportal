import React from 'react';
import {render} from 'react-dom';

import {Bar} from 'react-chartjs-2';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class ContainerBarChart extends React.Component {
    constructor(props){
      super(props);
      this._onChange = this._onChange.bind(this);
      this.state = {strings: getAppState()};
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

    render() {

        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.props.title}</h3>
              </div>
              <div className="box-body">
                <Bar data={this.props.data} height={this.props.height} options={this.props.options}/>
              </div>
            </div>
        );
    }
}

module.exports = ContainerBarChart;