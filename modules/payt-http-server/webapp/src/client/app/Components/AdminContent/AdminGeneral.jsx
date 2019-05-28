import React from 'react';
import { Route } from 'react-router-dom';
import NoMessage from '../Widgets/NoMessage.jsx';
import LoginTable from '../Widgets/Tables/LoginTable.jsx';
import LoginBarChart from '../Widgets/Charts/LoginBarChart.jsx';

class AdminGeneral extends React.Component { 
    render() {                  
        return (
            <div>
                <NoMessage />
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-xs-12"><LoginTable /></div>
                    <div className="col-lg-6 col-md-12 col-xs-12"><LoginBarChart /></div>
                </div>
            </div>
        )
    }
}

module.exports = AdminGeneral;