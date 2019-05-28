import React from 'react';
import {render} from 'react-dom';

import GMap from '../Widgets/GMap.jsx';
import ContainersTable from '../Widgets/Tables/ContainersTable.jsx';
import ContainerLineChart from '../Widgets/Containers/ContainerLineChart.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class ContainersContent extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            strings: getAppState(),
            positions: [],
            center: [],
        };
  
        this._onChange = this._onChange.bind(this);
        this.setPositions = this.setPositions.bind(this);

        window.payt_session.call('payt.'+window.county+'.db.private.get_containers', {callback: function (res){
            var pos=[];
            var totLat = 0;
            var totLong = 0;
            var nCont = 0;

            res.forEach(container => {
                var tmp = [];
                if(!_.isEqual(container.location, [0,0])){
                    nCont++;
                    totLong += container.location[0];
                    totLat += container.location[1];

                    tmp.push(container.location[1]);
                    tmp.push(container.location[0]);
                    
                    pos.push({id: container.id,coord: tmp});
                }
            });
            
            var cLat = totLat/nCont;
            var cLong = totLong/nCont;
            var c = [cLat,cLong];

            this.setPositions(pos,c);
		}.bind(this),
            exchange: window.county
        });
    }

    /* Change Zoom */

    componentDidMount(){
        TranslationsStore.addChangeListener(this._onChange);
        //render(<ContainerLineChart id={this.props.positions[0].id}/>,document.getElementById('detailsContainers'));
    }

    // Unbind change listener
    componentWillUnmount() {
        TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({strings:getAppState()});
    }

    setPositions(pos,c){
        this.setState({positions: pos, center: c});
    }

    render() {
        var marker = L.icon({
            iconUrl: '/public/dist/img/bin.png',
            iconSize: [20, 30],
            iconAnchor: [22, 30],
            popupAnchor: [-12, -32],
        });

        return (
            <div>
              <div id='containers' className="row">
                <div className="col-lg-6 col-xs-12">
                    <GMap height={570} zoom={10} type='container' positions={this.state.positions} center={this.state.center} marker={marker} marker_name={this.state.strings.ContainersContent.markerName} title={this.state.strings.ContainersContent.gmapTitle} enable={true}/>
                </div>
                <div className="col-lg-6 col-xs-12" id="detailsContainers"></div>
              </div>
              <div id='listContainers' className="row">
                <div className="col-lg-12"><ContainersTable /></div>
              </div>
            </div>
        );
    }
}

module.exports = ContainersContent;