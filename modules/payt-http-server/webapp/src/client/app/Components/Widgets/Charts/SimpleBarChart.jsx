import React from 'react';
import {render} from 'react-dom';

import {Line,Bar} from 'react-chartjs-2';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class SimpleBarChart extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            strings: getAppState()
        }

        this._onChange = this._onChange.bind(this);
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
        var data={};

        if(this.props.data!=null)
          data = this.props.data;

        return(
            <div className="box box-success">
              <div className="box-header with-border">
                <i className="fa fa-bar-chart-o"></i>
                <h3 className="box-title">{this.props.text}</h3>
              </div>
              <div className="box-body">
                <Bar data={data} height={400} options={this.props.options}/>
              </div>
            </div>
        );
    }
}

module.exports = SimpleBarChart;