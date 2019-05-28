import React from 'react';
import { Button, Checkbox, Col, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import sha256 from 'sha256';
import * as UserInfoActions from '../Flux/Actions/UserInfoActions';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
    return TranslationsStore.getStrings();
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.login = this.login.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.state = { strings: getAppState(), redirectToReferrer: false};
    }

    // Listen for changes
    componentDidMount() {
        TranslationsStore.addChangeListener(this._onChange);

        $('.form-control').keypress(function() {
            $('.form-group').removeClass('wrong-entry');
        });
    }

    // Unbind change listener
    componentWillUnmount() {
        TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({ strings: getAppState() });
    }

    create_cookie(name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000) + 300000);
        var expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    read_cookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    login() {
        let username = this.inputUsername.value;
        let password = sha256(this.inputPassword.value);
        let _remember_me = this.inputRememberme.checked;

        window.remember_me = _remember_me;

        window.payt_session.call('payt.auth.payt_login', {
            exchange: 'auth',
            args: [username, password],
            callback: function (data) {
                switch (data.code) {
                    case 1:
                        var myCookie = this.read_cookie("lang");

                        if (myCookie == null)
                            this.create_cookie('lang', 'pt', 365);

                        var user_id = data.user_id;
                        var token = data.token;
                        var validated = data.validated;

                        if (validated) {
                            console.log('validated: ' + validated);
                            if (user_id && token) {
                                this.create_cookie('user_id', user_id, _remember_me ? 5 : 0);
                                this.create_cookie('access_token', token, _remember_me ? 5 : 0);
                                window.payt_session.connect({ username: user_id, password: token });
                            }

                            var waitConnected = () => setTimeout(() => {
                                if(window.payt_session.is_connected()){
                                    $('#myModal').modal('hide');
                                    UserInfoActions.updateAuthenticated(true);
                                    this.setState({ redirectToReferrer: true });
                                }
                                else
                                    waitConnected();
                            }, 150);

                            waitConnected = waitConnected.bind(this);
                            waitConnected();
                        } else
                            this.props.displaySignUpForm(user_id, token, _remember_me);
                        break;
                    case 0:
                        $('.log-status').addClass('wrong-entry');
                        $('.log-status').effect("shake");
                        $('.general-alert').text(this.state.strings.General.Login.invalidCredentials);
                        $('.general-alert').fadeIn(500);
                        setTimeout("$('.general-alert').fadeOut(1500);", 3000);

                        break;
                    case -1:
                        $('.log-status').addClass('wrong-entry');
                        $('.log-status').effect("shake");
                        $('.general-alert').text(this.state.strings.General.Login.temporarilySuspended+data.time+'min');
                        $('.general-alert').fadeIn(500);
                        setTimeout("$('.general-alert').fadeOut(1500);", 6000);
                        
                        break;
                    case -2:
                        $('.log-status').addClass('wrong-entry');
                        $('.log-status').effect("shake");
                        $('.general-alert').text(this.state.strings.General.Login.accountBlocked);
                        $('.general-alert').fadeIn(500);
                        setTimeout("$('.general-alert').fadeOut(1500);", 6000);
                        
                        break;
                    default:
                        break;
                }
            }.bind(this)
        });
    }

    resetPassword(){
        this.props.displayResetPasswordForm();
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }

        return (
            <div className="modal-dialog" id="login-modal">
                <div className="modal-content" id="signIn">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title"><i className="fas fa-sign-in-alt"></i>{this.state.strings.General.Login.signin}</h4>
                    </div>
                    <div className="modal-body">
                        <div className="login-box-body">
                            <Form id="formLogin" ref="form" horizontal>
                                <FormGroup controlId="formUsername">
                                    <Col componentClass={ControlLabel} sm={4}>{this.state.strings.General.Login.username}</Col>
                                    <Col sm={8}>
                                        <FormControl type="text" placeholder={this.state.strings.General.Login.username} inputRef={ref => { this.inputUsername = ref; }} />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="formPassword" bsClass="form-group log-status">
                                    <Col componentClass={ControlLabel} sm={4}>{this.state.strings.General.Login.password}</Col>
                                    <Col sm={8}>
                                        <FormControl type="password" placeholder={this.state.strings.General.Login.password} inputRef={ref => { this.inputPassword = ref; }} />
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col smOffset={8} sm={4}>
                                        <Checkbox bsClass="checkbox pull-right" inputRef={ref => { this.inputRememberme = ref; }}>{this.state.strings.General.Login.rememberme}</Checkbox>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col smOffset={8} sm={4}>
                                        <a className="pull-right" onClick={this.resetPassword} style={{textDecoration: 'underline', cursor: 'pointer'}}>
                                            {this.state.strings.General.Login.resetPassword}
                                        </a>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={8}>
                                        <span name="denied" className="general-alert"></span>
                                    </Col>
                                    <Col sm={4}>
                                        <Button bsClass="general-btn general-btn-2 btn-block general-btn-flat general-btn-conf" onClick={this.login}>{this.state.strings.General.Login.signin}</Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Login;