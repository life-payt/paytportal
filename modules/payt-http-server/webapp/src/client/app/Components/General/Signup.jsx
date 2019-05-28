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

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.signup = this.signup.bind(this);
        this.state = { strings: getAppState(), redirectToReferer: false};
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

    errorShake(selector, text) {
        $(selector).addClass('wrong-entry');
        $(selector).effect("shake");
        $('.alert').text(text);
        $('.alert').fadeIn(500);
    }

    signup() {
        var { user_id, token, _remember_me } = this.props;
        var email = this.inputEmail.value;
        //var subscribe = this.inputSubscribe.checked ? 1 : 0;
        var passwd = this.inputPassword.value;
        var confirm_passwd = this.inputCPassword.value;
        var error = false;

        if (passwd !== confirm_passwd) {
            this.errorShake('.log-status', this.state.strings.General.Signup.cpErrorNotMatch);
            error = true;
        }
        else if(passwd.length < 8){
            this.errorShake('.log-status', this.state.strings.General.Signup.cpErrorLength);
            error = true;
        } 
        else {
            if (!email) {
                this.errorShake('#su_email', this.state.strings.General.Signup.requiredFields);
                error = true;
            }
            if (!passwd) {
                this.errorShake('#su_passwd', this.state.strings.General.Signup.requiredFields);
                error = true;
            }
            if (!confirm_passwd) {
                this.errorShake('#su_cpasswd', this.state.strings.General.Signup.requiredFields);
                error = true;
            }
        }

        if (error) {
            setTimeout("$('.alert').fadeOut(1500);", 3000);
        } else {
            /*window.payt_session.call('payt.auth.set_mailing', {
                exchange: 'auth',
                args: [subscribe],
                callback: function (res) {
                    console.log(res);
                }.bind(this)
            });*/

            window.payt_session.call('payt.auth.validate_user', {
                exchange: 'auth',
                args: [user_id, email, sha256(passwd)],
                callback: function (res) {
                    if (!res) {
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
                        
                    } else {
                        console.log('Old & new passwords are the same, try again');
                    }
                }.bind(this)
            });
        }
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
            <div className="modal-dialog">
                <div className="modal-content" id="signUp">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title"><i className="fas fa-sign-in-alt"></i> {this.state.strings.General.Signup.signup}</h4>
                    </div>
                    <div className="modal-body">
                        <div className="login-box-body">
                            <p>{this.state.strings.General.Signup.infoText}</p>
                            <Form id="formSignUp" ref="form" horizontal>
                                <FormGroup controlId="su_email">
                                    <Col componentClass={ControlLabel} sm={4}>E-Mail</Col>
                                    <Col sm={8}>
                                        <FormControl type="email" placeholder="E-Mail" inputRef={ref => { this.inputEmail = ref; }} />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="su_passwd" bsClass="form-group log-status">
                                    <Col componentClass={ControlLabel} sm={4}>{this.state.strings.General.Signup.password}</Col>
                                    <Col sm={8}>
                                        <FormControl type="password" placeholder={this.state.strings.General.Signup.password} inputRef={ref => { this.inputPassword = ref; }} />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="su_cpasswd" bsClass="form-group log-status">
                                    <Col componentClass={ControlLabel} sm={4}>{this.state.strings.General.Signup.cpassword}</Col>
                                    <Col sm={8}>
                                        <FormControl type="password" placeholder={this.state.strings.General.Signup.cpassword} inputRef={ref => { this.inputCPassword = ref; }} />
                                    </Col>
                                </FormGroup>
                                {/*<FormGroup>
                                    <Col smOffset={8} sm={4}>
                                        <Checkbox bsClass="checkbox pull-right" inputRef={ref => { this.inputSubscribe = ref; }}>{this.state.strings.General.Signup.subscribe}</Checkbox>
                                    </Col>
                                </FormGroup>*/}
                                <FormGroup>
                                    <Col sm={8}>
                                        <span name="denied" className="general-alert"></span>
                                    </Col>
                                    <Col sm={4}>
                                        <Button bsClass="general-btn general-btn-2 general-btn-block general-btn-flat general-btn-conf" onClick={this.signup}>{this.state.strings.General.Signup.submit}</Button>
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

module.exports = Signup;