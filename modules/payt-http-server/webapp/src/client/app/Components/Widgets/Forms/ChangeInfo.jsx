import React from 'react';
import {render} from 'react-dom';
import sha256 from 'sha256';
import { Form, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

var UserInfoStore = require('../../Flux/Stores/UserInfoStore');
var TranslationsStore = require('../../Flux/Stores/TranslationsStore');
import * as NotificationsActions from '../../Flux/Actions/NotificationsActions';
import * as UserInfoActions from '../../Flux/Actions/UserInfoActions';

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

function getUser() {
	return UserInfoStore.getUserInfo();
}

// TODO: Refactor to use react-bootstrap form instead html form
// * : Change notification messages 
class ChangeInfo extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onUserInfoChange = this._onUserInfoChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);

        let user = getUser();
        this.state = {
            strings:getAppState(),
            name: user.name || '',
            email: user.email || ''
        };
    }

    // Listen for changes
    componentDidMount() {
      TranslationsStore.addChangeListener(this._onChange);
      UserInfoStore.addChangeListener(this._onUserInfoChange);
    }

    // Unbind change listener
    componentWillUnmount() {
      TranslationsStore.removeChangeListener(this._onChange);
      UserInfoStore.removeChangeListener(this._onUserInfoChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    _onUserInfoChange() {
        let user = getUser();
        this.setState({name: user.name, email: user.email});
    }

    handleNameChange(e){
        this.setState({ name: e.target.value });
    }

    getValidationName(){
        const length = this.state.name.length;
        const isNew = this.state.name != getUser().name;
        if (length > 2 && isNew) return 'success';
        else if (length > 0 && isNew) return 'error';
        return null;
    }

    handleEmailChange(e){
        this.setState({ email: e.target.value });
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }

    getValidationEmail(){
        const valid = this.state.email ? this.validateEmail(this.state.email) : false;
        const length = this.state.email.length;
        const isNew = this.state.email != getUser().email;
        if (valid && isNew) return 'success';
        else if (length > 0 && !valid && isNew) return 'error';
        return null;
    }

    changeName(event) {
        event.preventDefault();

        var name = this.state.name;
        window.payt_session.call('payt.auth.internal.edit_alias',{
            args: [name],
            callback: function (res){
                switch(res){
                    case 0:
                        NotificationsActions.addNotification({text: this.state.strings.ChangeInfo.cnSuccess,type:'success'});
                        break;
                    case 1:
                        NotificationsActions.addNotification({text: this.state.strings.ChangeInfo.cnErrorOther,type:'danger'});
                        break;
                    default: break;
                }
            }.bind(this),
            exchange: 'auth'
        });
    }

    changeEmail(event) {
        event.preventDefault();

        var email = this.state.email;

        window.payt_session.call('payt.auth.update_email',{
            args: [email],
            callback: function (res){
                switch(res){
                    case 0:
                        NotificationsActions.addNotification({text: this.state.strings.ChangeInfo.ceSuccess,type:'success'});
                        break;
                    case 1:
                        NotificationsActions.addNotification({text: this.state.strings.ChangeInfo.ceErrorOther,type:'danger'});
                        break;
                    default: break;
                }
            }.bind(this),
            exchange: 'auth'
        });
        
    }

    handleSave(event){
        let { name, email } = this.state;
        const isNewEmail = this.state.email != getUser().email;
        const isNewName = this.state.name != getUser().name;

        if(isNewEmail){
            if(this.getValidationEmail() == 'success'){
                this.changeEmail(event);
                UserInfoActions.updateEmail(email);
            }
            else
                NotificationsActions.addNotification({text: this.state.strings.ChangeInfo.ceErrorInvalid,type:'danger'});
        }

        if(isNewName){
            if(this.getValidationName() == 'success'){
                this.changeName(event);
                UserInfoActions.updateName(name);
            }
            else
                NotificationsActions.addNotification({text: this.state.strings.ChangeInfo.cnErrorInvalid,type:'danger'});
        }
    }

    render() {
        return(
            <Form id="formChangeInfo" ref="form" horizontal>
                <div className="box-body">
                    <FormGroup controlId="inputName" validationState={this.getValidationName()}>
                        <Col componentClass={ControlLabel} sm={4}>{this.state.strings.ChangeInfo.name}</Col>
                        <Col sm={5}>
                            <FormControl onChange={this.handleNameChange} type="text" value={this.state.name} placeholder={this.state.strings.ChangeInfo.name} inputRef={ref => { this.inputName = ref; }}/>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="inputEmail" validationState={this.getValidationEmail()}>
                        <Col componentClass={ControlLabel} sm={4}>{this.state.strings.ChangeInfo.email}</Col>
                        <Col sm={5}>
                            <FormControl onChange={this.handleEmailChange} type="e-mail" value={this.state.email} placeholder={this.state.strings.ChangeInfo.email} inputRef={ref => { this.inputEmail = ref; }}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={4} sm={5}>
                            <a onClick={this.handleSave.bind(this)} className="btn btn-success">{this.state.strings.ChangeInfo.btnC}</a>
                        </Col>
                    </FormGroup>
                </div>
            </Form>
        );
    }
}

module.exports = ChangeInfo;