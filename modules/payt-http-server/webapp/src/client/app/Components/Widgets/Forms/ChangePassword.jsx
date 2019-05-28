import React from 'react';
import {render} from 'react-dom';
import sha256 from 'sha256';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');
import * as NotificationsActions from '../../Flux/Actions/NotificationsActions';

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

// TODO: Refactor to use react-bootstrap form instead html form
class ChangePassword extends React.Component {
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {strings:getAppState()};
    }

    // Listen for changes
    componentDidMount() {
      TranslationsStore.addChangeListener(this._onChange);
    }

    // Unbind change listener
    componentWillUnmount() {
      TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    changeP(event) {
        event.preventDefault();

        var cp = this.refs.currentPassword.value;
        var np = this.refs.inputNewPassword.value;
        var npc = this.refs.inputNewPasswordC.value;

        if(np !== npc)
            NotificationsActions.addNotification({text: this.state.strings.ChangePassword.cpErrorNotMatch,type:'danger'});
        else if(np.length < 8)
            NotificationsActions.addNotification({text: this.state.strings.ChangePassword.cpErrorLength,type:'danger'});
        else{
            window.payt_session.call('payt.auth.change_pw',{
                args: [sha256(cp),sha256(np)],
                callback: function (res){
                    switch(res){
                        case 0:
                            NotificationsActions.addNotification({text: this.state.strings.ChangePassword.cpSuccess,type:'success'});
                            this.refs.currentPassword.value = "";
                            this.refs.inputNewPassword.value = "";
                            this.refs.inputNewPasswordC.value = "";
                            break;
                        case 1:
                            NotificationsActions.addNotification({text: this.state.strings.ChangePassword.cpErrorOther,type:'danger'});
                            break;
                        case 2:
                            NotificationsActions.addNotification({text: this.state.strings.ChangePassword.cpErrorCurrentWrong,type:'danger'});
                            break;
                        case 3:
                            NotificationsActions.addNotification({text: this.state.strings.ChangePassword.cpErrorNewSameOld,type:'danger'});
                            break;
                        default: break;
                    }
                }.bind(this),
                exchange: 'auth'
            });
        }
    }

    render() {
        return(
            <form role="form" className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="inputCurrentPassword" className="col-sm-4 control-label">{this.state.strings.ChangePassword.currentPassword}</label>
                    <div className="col-sm-5">
                        <input ref="currentPassword" type="password" className="form-control" id="inputCurrentPassword" placeholder={this.state.strings.ChangePassword.currentPassword}></input>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputNewPassword" className="col-sm-4 control-label">{this.state.strings.ChangePassword.newPassword}</label>
                    <div className="col-sm-5">
                        <input ref="inputNewPassword" type="password" className="form-control" id="inputNewPassword" placeholder={this.state.strings.ChangePassword.newPassword}></input>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputNewPasswordC" className="col-sm-4 control-label">{this.state.strings.ChangePassword.newPasswordC}</label>
                    <div className="col-sm-5">
                        <input ref="inputNewPasswordC" type="password" className="form-control" id="inputNewPasswordC" placeholder={this.state.strings.ChangePassword.newPasswordC}></input>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-4 col-sm-5">
                        <a href="#" onClick={this.changeP.bind(this)} className="btn btn-success">{this.state.strings.ChangePassword.btnC}</a>
                    </div>
                </div>
            </form>
        );
    }
}

module.exports = ChangePassword;