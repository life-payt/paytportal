import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router-dom';

import CountyBusinessContent from '../CountyContent/CountyBusiness.jsx';
import ProducersContent from '../CountyContent/Producers.jsx';
import UploadContent from '../CountyContent/UploadContent.jsx';
import MunBusinessSettings from '../CountyContent/MunBusinessSettings.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class MunBusinessSideBar extends React.Component { 
    constructor(props) {
        super(props);
        
        var list_active = [1,0,0];	

        this.state = {
            isActive: list_active,
            strings: getAppState()
        };

        this._onChange = this._onChange.bind(this);
    }

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

    changeContent(index) {
        var tmp = [0,0,0];

        tmp[index] = 1;
        this.setState({ isActive: tmp});

        var content = null;

        // Trocar por this.state.positions
        var positions = [[38.720964, -9.153455],[38.736741, -9.121194],[38.726556, -9.170470],[38.749765, -9.152344],
                  [38.763590, -9.124271],[38.774258, -9.096291],[38.795634, -9.103109],[38.793403, -9.123276]];

        var pos=[];
        var totLat = 0;
        var totLong = 0;
        var nCont = 0;

        for(var i=0;i<positions.length;i++){
          if(positions[i]){
            pos.push({id: i, coord: positions[i]});
          }
        }

        /*
        var marker = L.icon({
          iconUrl: '/public/dist/img/factory.png',
          iconSize: [20, 30],
          iconAnchor: [22, 30],
          popupAnchor: [-12, -32],
        });*/

        var marker_name=this.state.strings.MunBusinessSideBar.markerName;

        switch(index){
            case 0:
              content = <CountyBusinessContent />;
              break;
            case 1:
	            content = <ProducersContent positions={pos} marker_name={marker_name} gmapTitle={this.state.strings.MunBusinessSideBar.gmapTitle} />;
              break;
            case 2:
              content = <UploadContent />;
              break;
            case 3:
              content = <MunBusinessSettings />;
              break;
            default:
              break;
        }

	      render(content, document.getElementById('list_rows'));
    }

    render() {
        return (
          <aside className="main-sidebar">   
              <section className="sidebar">
                
                <div className="user-panel">
                  <div className="pull-left image">
                    <img src="/public/dist/img/logo.png" className="img-circle" alt="User Image"></img>
                  </div>
                  <div className="pull-left info">
                    <p> {this.props.name}</p>
                    <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                  </div>
                </div>

                <ul className="sidebar-menu">
                  <li className="header">{this.state.strings.MunBusinessSideBar.mainMenu}</li>
                  <li className={ this.props.location.pathname.includes("/county/gstats") ? 'active' : '' } /*onClick={this.changeContent.bind(this,0)}*/>
                    <Link to={{ pathname: '/county/gstats', state: { title: this.state.strings.MunBusinessSideBar.generalStats }}}>
                      <i className="fa fa-chart-pie"></i> <span>{this.state.strings.MunBusinessSideBar.generalStats}</span>
                    </Link>
                  </li>
                  <li className={ this.props.location.pathname.includes("/county/producers") ? 'active' : '' } /*onClick={this.changeContent.bind(this,1)}*/>
                    <Link to={{ pathname: '/county/producers', state: { title: this.state.strings.MunBusinessSideBar.producers }}}>
                      <i className="fa fa-users"></i> <span>{this.state.strings.MunBusinessSideBar.producers}</span>
                    </Link>
                  </li>
                  <li className={ this.props.location.pathname.includes("/county/upload") ? 'active' : '' } /*onClick={this.changeContent.bind(this,2)}*/>
                    <Link to={{ pathname: '/county/upload', state: { title: this.state.strings.MunBusinessSideBar.upload }}}>
                      <i className="fa fa-cloud-upload-alt"></i> <span>{this.state.strings.MunBusinessSideBar.upload}</span>
                    </Link>
                  </li>
                  <li className={ this.props.location.pathname.includes("/county/settings") ? 'active' : '' } /*onClick={this.changeContent.bind(this,3)}*/>
                    <Link to={{ pathname: '/county/settings', state: { title: this.state.strings.MunBusinessSideBar.settings }}}>
                      <i className="fa fa-gears"></i> <span>{this.state.strings.MunBusinessSideBar.settings}</span>
                    </Link>
                  </li>
                  <li>
                    <a href='https://manual.life-payt.eu/pt'>
                      <i className="fa fa-question-circle"></i> <span>{this.state.strings.MunBusinessSideBar.help}</span>
                    </a>
                  </li>
                </ul>
              </section>
          </aside>
        );
    }
}

module.exports = MunBusinessSideBar;