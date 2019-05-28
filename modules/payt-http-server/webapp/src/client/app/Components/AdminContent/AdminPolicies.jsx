import React from 'react';
import PoliciesTable from '../Widgets/Tables/PoliciesTable.jsx';
import PermissionsTable from '../Widgets/Tables/PermissionsTable.jsx';
import { Form, FormGroup, Col, ControlLabel, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class AdminPolicies extends React.Component {
    constructor(props){
        super(props);
        this.changeFilter = this.changeFilter.bind(this);
        this._onChange = this._onChange.bind(this);

        this.state = {
            services: ['Auth', 'Aveiro', 'Lisbon'],
            filter: '',
            strings: getAppState(),
        }
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

    changeFilter(value){
        this.setState({filter: value});
    }

    render() {
        const noFilter = this.state.strings.AdminPolicies.noFilter;

        return (
            <div>
                <div className="col-lg-12">
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={1}>{this.state.strings.AdminPolicies.filter}</Col>
                            <ButtonToolbar>
                                <ToggleButtonGroup type="radio" name="options" defaultValue={0}>
                                    <ToggleButton value={0} onClick={this.changeFilter.bind(this,'')}>{noFilter}</ToggleButton>
                                    {this.state.services.map( (service, index) => <ToggleButton key={index} value={index+1} onClick={this.changeFilter.bind(this,service)}>{service}</ToggleButton>)}
                                </ToggleButtonGroup>
                            </ButtonToolbar>
                        </FormGroup>
                    </Form>
                </div>
                <div className="col-lg-5 col-md-12 col-xs-12"><PoliciesTable filter={this.state.filter}/></div>
                <div className="col-lg-7 col-md-12 col-xs-12"><PermissionsTable filter={this.state.filter}/></div>
            </div>
        )
    }
}

module.exports = AdminPolicies;