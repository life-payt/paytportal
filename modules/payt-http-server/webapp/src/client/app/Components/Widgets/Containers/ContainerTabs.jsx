import React from 'react';
import {render} from 'react-dom';

import { Tabs, Tab } from 'react-bootstrap';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class ContainerTabs extends React.Component {
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
        var tabsList = [];
        
        this.props.tabs.forEach((tab,index) => {
            tabsList.push(
                <Tab key={index+1} eventKey={index+1} title={tab.title}>
                    {tab.content}
                </Tab>
            );
        });

        return(
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">{this.state.strings.ContainerTabs.title}</h3>
              </div>
              <div className="box-body">
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    {tabsList}
                </Tabs>
              </div>
            </div>
        );
    }
}

module.exports = ContainerTabs;