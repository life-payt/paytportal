import React from 'react';
import { render } from 'react-dom';
import { withRouter, Redirect } from 'react-router-dom';
import { Form, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import sha256 from 'sha256';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
    return TranslationsStore.getStrings();
}

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
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

    errorShake(selector, text) {
        $(selector).addClass('wrong-entry');
        $(selector).effect("shake");
        $('.alert').text(text);
        $('.alert').fadeIn(500);
    }

    resetPassword() {
        var username = this.inputUsername.value;
        var mk = this.inputMasterkey.value;
        var error = false;

        window.payt_session.call('payt.auth.internal.reset_pw', {
            exchange: 'auth',
            args: [username, sha256(mk)],
            callback: function (res) {
                if(res == 0){
                    $('#myModal').modal('hide');
                    this.setState({ redirectToReferrer: true });
                }
                else{
                    this.errorShake('.log-status', this.state.strings.General.ResetPassword.rpError);
                    setTimeout("$('.alert').fadeOut(1500);", 3000);
                }
            }.bind(this)
        });
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
                <div className="modal-content" id="resetPassword">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title"><i className="fas fa-key"></i> {this.state.strings.General.ResetPassword.title}</h4>
                    </div>
                    <div className="modal-body">
                        <div className="login-box-body">
                            <p>{this.state.strings.General.ResetPassword.infoText}</p>
                            <hr />
                            <Form id="formSignUp" ref="form" horizontal>
                                <FormGroup controlId="rp_username">
                                    <Col componentClass={ControlLabel} sm={4}>{this.state.strings.General.ResetPassword.username}</Col>
                                    <Col sm={8}>
                                        <FormControl type="text" placeholder={this.state.strings.General.ResetPassword.username} inputRef={ref => { this.inputUsername = ref; }} />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="rp_masterkey">
                                    <Col componentClass={ControlLabel} sm={4}>{this.state.strings.General.ResetPassword.masterkey}</Col>
                                    <Col sm={8}>
                                        <FormControl type="password" placeholder={this.state.strings.General.ResetPassword.masterkey} inputRef={ref => { this.inputMasterkey = ref; }} />
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={8}>
                                        <span name="denied" className="general-alert"></span>
                                    </Col>
                                    <Col sm={4}>
                                        <Button bsClass="general-btn general-btn-2 general-btn-block general-btn-flat general-btn-conf pull-right" onClick={this.resetPassword}>{this.state.strings.General.ResetPassword.submit}</Button>
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

module.exports = ResetPassword;