import React from 'react';
import ServicesTable from '../Widgets/Tables/ServicesTable.jsx';

class AdminServices extends React.Component { 
    render() {                  
        return (
            <div>
                <div className="col-lg-12 col-md-12 col-xs-12"><ServicesTable /></div>
            </div>
        )
    }
}

module.exports = AdminServices;