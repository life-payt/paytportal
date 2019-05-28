import React from 'react';
import {render} from 'react-dom';

import { DropdownButton, MenuItem, Dropdown } from 'react-bootstrap';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');
var moment = require('moment');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class RangePicker extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        let strings = getAppState();

        let rangeNames = [...Object.keys(props.ranges),strings.RangePicker.labelInt];

        this.state = {
            strings: strings,
            chosenIndex: rangeNames.length-1,
            rangeNames: rangeNames,
            picker: {
                chosenLabel: strings.RangePicker.labelInt,
                startDate: moment(),
                endDate: moment()
            }
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
    
    componentWillReceiveProps(nextProps){
        let strings = getAppState();
        let rangeNames = [...Object.keys(nextProps.ranges),strings.RangePicker.labelInt];
        this.setState({
            rangeNames: rangeNames,
        });
    }
    
    _onChange() {
        let strings = getAppState();
        let chosenIndex = this.state.chosenIndex;
        let oldRangeNames = this.state.rangeNames.slice(0,-1);
        let newRangeNames = [...oldRangeNames,strings.RangePicker.labelInt];
        this.setState({
            strings:strings,
            rangeNames: newRangeNames
        });
    }

    handleSelect(index, eventKey){
        let range = this.props.ranges[eventKey];
        let newPicker = {
            chosenLabel: eventKey,
            startDate: range[0],
            endDate: range[1]
        };

        this.setState({
            picker: newPicker,
            chosenIndex: index,
        });

        this.props.onApply(newPicker);
    }

    render() {
        let items = [];
        let chosenIndex = this.state.chosenIndex;
        
        Object.keys(this.props.ranges).forEach((rangeName,index) => {
            items.push(<MenuItem eventKey={rangeName} onSelect={this.handleSelect.bind(this,index)} key={index} active={index==chosenIndex}>{rangeName}</MenuItem>);
        });

        let title = <span><i className="glyphicon glyphicon-calendar"></i>  {this.state.rangeNames[this.state.chosenIndex]}</span>;

        return(
            <div id='dropdown-rangepicker'>
                <DropdownButton bsStyle="default" title={title} id='RangePicker'>
                    {items}
                </DropdownButton>
            </div>
        );
    }
}

module.exports = RangePicker;