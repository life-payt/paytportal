import React from 'react';
import { render } from 'react-dom';
import { Redirect } from 'react-router-dom';
import Header from './General/Header.jsx';
import Logo from './General/Logo.jsx';
import Main from './General/Main.jsx';
import Footer from './General/Footer.jsx';
import Login from './General/Login.jsx';
import Signup from './General/Signup.jsx';
import ResetPassword from './General/ResetPassword.jsx';
import sha256 from 'sha256';

var UserInfoStore = require('./Flux/Stores/UserInfoStore');

function getUserState() {
	return UserInfoStore.getUserInfo().isAuthenticated;
}

class General extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: false,
            signup: false,
            reset: false,
            user_id: '',
            token: '',
            remember_me: false
        };

        this.displaySignUpForm = this.displaySignUpForm.bind(this);
        this.displaySignInForm = this.displaySignInForm.bind(this);
        this.displayResetPasswordForm = this.displayResetPasswordForm.bind(this);
    }

    componentWillMount(){
        if(getUserState())
            this.props.history.push('/dashboard');
    }

    displaySignInForm() {
        this.setState({ login: true, signup: false, reset: false });
    }

    displaySignUpForm(user_id, token, _remember_me) {
        this.setState({ login: false, signup: true, reset: false, user_id: user_id, token: token, _remember_me: _remember_me });
    }

    displayResetPasswordForm() {
        this.setState({ login: false, signup: false, reset: true });
    }

    render() {
        return (
            <div className="general">
                <Header {... this.props}/>
                <Logo openLogin={this.displaySignInForm} {... this.props}/>
                <Main {... this.props}/>
                <Footer {... this.props}/>
                <div id="myModal" className="modal fade" role="dialog">
                    {this.state.login ? <Login displaySignUpForm={this.displaySignUpForm} displayResetPasswordForm={this.displayResetPasswordForm} {... this.props}/> : ''}
                    {this.state.signup ? <Signup user_id={this.state.user_id} token={this.state.token} _remember_me={this.state._remember_me} {... this.props}/> : ''}
                    {this.state.reset ? <ResetPassword {... this.props}/> : ''}
                </div>
            </div>
        )
    }
}

module.exports = General;