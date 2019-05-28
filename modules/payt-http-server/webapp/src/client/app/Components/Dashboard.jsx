import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './MainComponents/Header.jsx';
import Main from './MainComponents/Main.jsx';
import Sidebar from './MainComponents/Sidebar.jsx';
import Footer from './MainComponents/Footer.jsx';

import * as UserInfoActions from './Flux/Actions/UserInfoActions';

class Dashboard extends React.Component { 
    constructor(props){
        super(props);
        
        this.init = this.init.bind(this);
        this.getUserParties = this.getUserParties.bind(this);

        this.state = {loaded: false}
    }

    componentDidMount(){
        $.AdminLTE.layout.fix();
        $.AdminLTE.layout.fixSidebar();
        this.init();
    }
    
    getUserParties(counties){
        counties.forEach((county,index) => {
            let cnt = county.toLowerCase();
            window.payt_session.call('payt.'+cnt+'.db.private.get_party_info', {callback: function (res){
                console.log(res);
                let party = res || {};
                UserInfoActions.updateParties([cnt,party]);
                if(index == 0){
                    UserInfoActions.updatePartyActiveByCounty(cnt);
                }
                if(index == counties.length-1){
                    this.setState({loaded: true});
                }
            }.bind(this),
                exchange: cnt
            });
        });
    }

    init(){
        window.payt_session.call('payt.auth.get_user_info', {callback: function (res){
            var role = res.role;
            var name = res.alias;
            var email = res.email;
            UserInfoActions.updateRole(role);
            UserInfoActions.updateInfo(name, email);
            
            switch (role) {
                case 'county':
                    window.payt_session.call('payt.auth.internal.get_county_info', {callback: function (res){
                        window.county = res.county;
                        window.payt_session._exchange_name = window.county;

                        let type = res.county === 'lisbon' ? 'business' : 'personal';

                        let user_info = { 
                            type: type
                        }
                        
                        UserInfoActions.updatePartyActiveByParty(user_info);
                        this.setState({loaded: true});
                    }.bind(this),exchange: 'auth'});
                    break;
                case 'user':
                    window.payt_session.call('payt.auth.get_counties_user', {callback: function (res){
                        window.county = res[0].toLowerCase();
                        window.payt_session._exchange_name = window.county;
                        
                        this.getUserParties(res);
                    }.bind(this),exchange: 'auth'});
                    break;
                default:
                    this.setState({loaded: true});
                    break;
            }
        }.bind(this),exchange: 'auth'});
    }

    render() {
        return (
            <div>
                <div id="header" className="main-header">
                    <Header {... this.props}/>
                </div>
                { this.state.loaded ?
                <div> 
                    <div id="sidebar">
                        <Sidebar {... this.props}/>
                    </div>
                    <div id="react-root" className="content-wrapper">
                        <Main {... this.props}/>
                    </div>
                </div>
                : null}
                <footer id="footer" className="main-footer">
                    <Footer {... this.props}/>
                </footer>
            </div>
        )
    }
}

module.exports = Dashboard;