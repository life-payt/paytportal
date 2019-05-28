import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../../Flux/Stores/TranslationsStore');
import { Form, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import sha256 from 'sha256';

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class UserForm extends React.Component{
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleCountyChange = this.handleCountyChange.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        //this.handlePasswordChange = this.handlePasswordChange.bind(this);
        //this.handleCPasswordChange = this.handleCPasswordChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.state = {
          strings:getAppState(),
          selectedOptions:null,
          multi: true,
          disabled: false,
          options: [],
          password: '',
          cpassword: '',
          username: '',
          role: '',
          email: ''
        };
    }

    // Listen for changes
    componentDidMount() {
      TranslationsStore.addChangeListener(this._onChange);
      window.payt_session.call('payt.auth.get_counties',{
          callback: function (res){
              let opts = [];
              Object.keys(res).forEach(key => {
                  opts.push({ value: key, label: res[key]});
              });
              this.setState({options: opts});
          }.bind(this),
          exchange: 'auth'
      });
    }

    // Unbind change listener
    componentWillUnmount() {
      TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    handleCountyChange(value){
      console.log('You\'ve selected:', value);
      this.setState({ selectedOptions: value });
    }

    getValidationCounty(){
      if ((this.state.selectedOptions && !this.state.multi) || (this.state.selectedOptions && this.state.selectedOptions.length > 0) || this.state.disabled) return 'success';
      else if (this.state.role) return 'error';
      return null;
    }

    handleUsernameChange(e){
      this.setState({ username: e.target.value });
    }

    getValidationUsername(){
      const length = this.state.username.length;
      if (length > 2) return 'success';
      else if (length > 0) return 'error';
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
      const valid = this.validateEmail(this.state.email);
      const length = this.state.email.length;
      if (valid) return 'success';
      else if (length > 0 && !valid) return 'error';
      return null;
    }

    handleRoleChange(event){
      if(this.inputRole.value === 'admin')
          this.setState({ disabled: true, selectedOptions: null, multi: false, role: 'admin'});
      else if(this.inputRole.value === 'county')
          this.setState({ disabled: false, selectedOptions: null, multi: false, role: 'county'});
      else
          this.setState({ disabled: false, selectedOptions: null, multi: true, role: this.inputRole.value});
    }

    getValidationRole(){
      const role = this.state.role;
      if (role != 'select' && role.length > 0) return 'success';
      else if (role == 'select') return 'error';
      return null;
    }

    /*
    handlePasswordChange(e) {
      this.setState({ password: e.target.value });
    }

    getValidationPassword(){
      const length = this.state.password.length;
      if (length > 7) return 'success';
      else if (length > 0) return 'error';
      return null;
    }

    handleCPasswordChange(e) {
      this.setState({ cpassword: e.target.value });
    }

    
    getValidationCPassword(){
      const length = this.state.cpassword.length;
      const equals = this.state.cpassword === this.state.password;
      if (length > 7 && equals) return 'success';
      else if (length > 0 && !equals) return 'error';
      return null;
    }*/

    validateAllFields(){
        let vUsername = this.getValidationUsername() == 'success';
        let vEmail = this.getValidationEmail() == 'success';
        let vRole = this.getValidationRole() == 'success';
        //let vPassword = this.getValidationPassword() == 'success';
        //let vCPassword = this.getValidationCPassword() == 'success';
        let vCounty = this.getValidationCounty() == 'success';

        //return vUsername && vEmail && vRole && vPassword && vCPassword && vCounty;
        return vUsername && vEmail && vRole && vCounty;
    }

    resetForm(){
        this.setState({
          selectedOptions: null,
          multi: true,
          disabled: false,
          password: '',
          cpassword: '',
          username: '',
          role: '',
          email: ''
        });
    }

    add() {
        if (this.validateAllFields()){
            let role = this.inputRole.selectedIndex;
            let username = this.state.username;
            let email = this.state.email;
            let county;
            if(role == 1)
                county = [];
            else if(role == 2)
                county = [parseInt(this.state.selectedOptions.value)];
            else {
                var tmp = [];
                this.state.selectedOptions.forEach(el => tmp.push(parseInt(el.value)));
                county = [...tmp];
            }

            this.props.action(username,email,role,county);
            this.resetForm();
            $('#exampleModal').modal('hide');
            $("#formAdd").trigger('reset');
        }
    }

    render() {

        return(
            <Form id="formAdd" ref="form" horizontal>
              <div className="box-body">
                <FormGroup controlId="formUsername" validationState={this.getValidationUsername()}>
                  <Col componentClass={ControlLabel} sm={4}>{this.state.strings.UserForm.username}</Col>
                  <Col sm={8}>
                    <FormControl onChange={this.handleUsernameChange} type="text" placeholder={this.state.strings.UserForm.username} inputRef={ref => { this.inputUsername = ref; }}/>
                  </Col>
                </FormGroup>
                <FormGroup controlId="formEmail" validationState={this.getValidationEmail()}>
                  <Col componentClass={ControlLabel} sm={4}>Email</Col>
                  <Col sm={8}>
                    <FormControl onChange={this.handleEmailChange} type="email" placeholder="Email" inputRef={ref => { this.inputMail = ref; }} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="formRole" validationState={this.getValidationRole()}>
                  <Col componentClass={ControlLabel} sm={4}>{this.state.strings.UserForm.role}</Col>
                  <Col sm={8}>
                    <FormControl componentClass="select" onChange={this.handleRoleChange} placeholder={this.state.strings.UserForm.select} inputRef={ref => { this.inputRole = ref; }}>
                      <option value="select">{this.state.strings.UserForm.select}</option>
                      <option value="admin">Admin</option>
                      <option value="county">County</option>
                      <option value="user">User</option>
                    </FormControl>
                  </Col>
                </FormGroup>
                {/*
                <FormGroup controlId="formPasswd" validationState={this.getValidationPassword()}>
                  <Col componentClass={ControlLabel} sm={4}>{this.state.strings.UserForm.password}</Col>
                  <Col sm={8}>
                    <FormControl onChange={this.handlePasswordChange} type="password" placeholder={this.state.strings.UserForm.password} inputRef={ref => { this.inputPassword = ref; }} />
                    <FormControl.Feedback />
                  </Col>
                </FormGroup>
                <FormGroup controlId="formCPasswd" validationState={this.getValidationCPassword()}>
                  <Col componentClass={ControlLabel} sm={4}>{this.state.strings.UserForm.cpassword}</Col>
                  <Col sm={8}>
                    <FormControl onChange={this.handleCPasswordChange} type="password" placeholder={this.state.strings.UserForm.cpassword} inputRef={ref => { this.inputCPassword = ref; }} />
                    <FormControl.Feedback />
                  </Col>
                </FormGroup>
                */}
                <FormGroup controlId="formCounty" validationState={this.getValidationCounty()}>
                  <Col componentClass={ControlLabel} sm={4}>{this.state.strings.UserForm.county}</Col>
                  <Col sm={8}>
                    <Select
                      name="select-county"
                      ref={(ref) => { this.select = ref; }}
                      multi={this.state.multi}
                      value={this.state.selectedOptions}
                      onChange={this.handleCountyChange}
                      placeholder={this.state.strings.UserForm.select}
                      singleValue
                      disabled={this.state.disabled}
                      options={this.state.options}
                    />
                  </Col>
                </FormGroup>
              </div>
              <div className="box-footer" style={{textAlign:'right'}}>
                <a onClick={this.add.bind(this)} className="btn btn-success">{this.state.strings.UserForm.add}</a>
              </div>
            </Form>
        );
    }
}

module.exports = UserForm;