import React from 'react';
import UsersTable from '../Widgets/Tables/UsersTable.jsx';
import RolesTable from '../Widgets/Tables/RolesTable.jsx';

class AdminUsers extends React.Component { 
    render() {                  
        return (
            <div className="row">
                <div className="col-lg-12 col-md-12 col-xs-12"><UsersTable /></div>
                <div className="col-lg-12 col-md-12 col-xs-12"><RolesTable /></div>
            </div>
        )
    }
}

module.exports = AdminUsers;