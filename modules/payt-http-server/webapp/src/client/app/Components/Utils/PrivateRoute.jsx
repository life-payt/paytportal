import React from 'react';
import { Route, Redirect } from 'react-router-dom';

var UserInfoStore = require('../Flux/Stores/UserInfoStore');

function getUserState() {
	return UserInfoStore.getUserInfo().isAuthenticated;
}

const PrivateRoute = ({ component: Component, path}) => ( 
    <Route path={path} render = { props => (
        getUserState() ? 
            ( <Component {...props }/>) 
            : 
            ( <Redirect to = {
                    {
                        pathname: '/general',
                        state: { from: props.location }
                    }
                }/>
            )
    )}/>
)

module.exports = PrivateRoute;