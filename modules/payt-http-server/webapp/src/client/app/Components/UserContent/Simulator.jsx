import React from 'react';
import {render} from 'react-dom';

import SimulForm from '../Widgets/Forms/SimulForm.jsx';

class Simulator extends React.Component {
    constructor(props){
        super(props);
        
    }

    render() {
        return(
            <div> 
                <div className="row">
                    <div className="col-lg-12">
                    <SimulForm />
                    </div>
                </div>
                <div className="row content">
                    <div className="col-lg-4 col-md-6 col-lg-offset-4 col-md-offset-3" id='simulResult'></div>
                </div>
            </div>
        );
    }
}

module.exports = Simulator;