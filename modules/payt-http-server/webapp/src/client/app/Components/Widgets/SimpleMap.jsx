import React from 'react';
import {render} from 'react-dom';

import ContainerLineChart from './Containers/ContainerLineChart.jsx';
import BoxHeader from './BoxHeader.jsx';
import DetailsBusiness from './DetailsBusiness.jsx';
import BarChart from './Charts/BarChart.jsx';
import { Map, Marker, Popup, TileLayer,Tooltip } from 'react-leaflet';
import Control from 'react-leaflet-control';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class SimpleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        strings: getAppState(),
        firstUpdate: true,
    };

    this._onChange = this._onChange.bind(this);

  }

  componentDidMount(){
    TranslationsStore.addChangeListener(this._onChange);
    this.mapApi = this.refs.map.leafletElement;
  }

  componentDidUpdate(prevProps, prevState){

    if(this.props.positions.length)
      this.fitBounds();
    if(this.props.type == "container" && this.props.positions.length && this.props.enable && this.state.firstUpdate){
      this.detailsMarker(this.props.positions[0].id,this.props.type);
      this.setState({firstUpdate: false});
    }
  }

  // Unbind change listener
  componentWillUnmount() {
    TranslationsStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({strings:getAppState()});
  }

  formatData() {

      var data1 = [["70L", 10], ["110L", 8], ["140L", 13], ["240L", 17], ["340L", 9], ["440L", 9], ["540L", 9], ["1000L", 7]];
      var data2 = [["70L", 8], ["110L", 9], ["140L", 7], ["240L", 6], ["340L", 14], ["440L", 5], ["540L", 11], ["1000L", 15]];
      var data3 = [["70L", 7], ["110L", 6], ["140L", 5], ["240L", 7], ["340L", 11], ["440L", 8], ["540L", 10], ["1000L", 11]];
      var data4 = [["70L", 9], ["110L", 7], ["140L", 9], ["240L", 8], ["340L", 12], ["440L", 6], ["540L", 7], ["1000L", 6]];
      var data5 = [["70L", 8], ["110L", 9], ["140L", 7], ["240L", 6], ["340L", 14], ["440L", 5], ["540L", 11], ["1000L", 15]];
      
      var dataValues1 = [];
      var dataValues2 = [];
      var dataValues3 = [];
      var dataValues4 = [];
      var dataValues5 = [];
      var dataLabels = [];
      for(var i=0; i<data1.length; i++){
          dataValues1.push(data1[i][1]);
          dataValues2.push(data2[i][1]);
          dataValues3.push(data3[i][1]);
          dataValues4.push(data4[i][1]);
          dataValues5.push(data4[i][1]);
          dataLabels.push(data1[i][0]);
      }

      const data = {
        labels: dataLabels,
        datasets: [
          {
            label: this.state.strings.SimpleMap.indif,
            backgroundColor: 'rgba(125, 128, 132, 0.6)',
            borderColor: 'rgba(125, 128, 132, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(125, 128, 132, 1)',
            hoverBorderColor: 'rgba(125, 128, 132, 1)',
            data: dataValues1
          },
          {
            label: this.state.strings.SimpleMap.pap_cart,
            backgroundColor: 'rgba(66, 128, 244, 0.6)',
            borderColor: 'rgba(66, 128, 244, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(66, 128, 244, 1)',
            hoverBorderColor: 'rgba(66, 128, 244, 1)',
            data: dataValues2
          },
          {
            label: this.state.strings.SimpleMap.glass,
            backgroundColor: 'rgba(19, 173, 13, 0.6)',
            borderColor: 'rgba(19, 173, 13, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(19, 173, 13, 1)',
            hoverBorderColor: 'rgba(19, 173, 13, 1)',
            data: dataValues3
          },
          {
            label: this.state.strings.SimpleMap.plast,
            backgroundColor: 'rgba(233, 237, 21, 0.6)',
            borderColor: 'rgba(233, 237, 21, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(233, 237, 21, 1)',
            hoverBorderColor: 'rgba(233, 237, 21, 1)',
            data: dataValues4
          },
          {
            label: this.state.strings.SimpleMap.organic,
            backgroundColor: 'rgba(203, 162, 130, 1)',
            borderColor: 'rgba(152, 73, 7, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(152, 73, 7, 1)',
            hoverBorderColor: 'rgba(152, 73, 7, 1)',
            data: dataValues5
          }
        ]
      };

      return data;
  }
  
  detailsMarker(index,type) {
      if(type=='container'){
        var chart = <ContainerLineChart id={index} /> 
        render(chart,document.getElementById('detailsContainers'));
      }
      else if(type=='factory'){
        var details = ( <div>
                          <BoxHeader index={index} />
                          <DetailsBusiness size={6} />
                        </div>);

        var data = this.formatData();

        var detBarChart = <BarChart data={data} type="containers" title={this.state.strings.SimpleMap.barChartTitle} />;
        render(details,document.getElementById('detailsProducers'));
        render(detBarChart,document.getElementById('containersBarChart'));
      }
      else{}
  }

  fitBounds(){
    this.mapApi.fitBounds(this.props.positions.map(pos => pos.coord));
  }

  doesNothing(){return}

  render() {
    var center = this.props.center;
    var positions = this.props.positions;
    var list_markers = [];
    var type = this.props.type;

    var myIcon = this.props.marker;

    // adicioanr icon={myIcon} ao <Marker />

    for(var i=0; i<positions.length; i++){
        let id = positions[i].id;
        var marker = <Marker key={i} position={positions[i].coord} onClick={this.props.enable == true ? this.detailsMarker.bind(this,id,type) : this.doesNothing}>
                        <Popup><span>{this.props.marker_name + ' ' + id}</span></Popup>
                        <Tooltip><span>{this.props.marker_name + ' ' + id}</span></Tooltip>
                     </Marker>

        list_markers.push(marker);
    }

    return (
        <div style={{ height:'100%' }}>
          <Map ref="map" zoom={this.props.zoom}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Control position="topleft" className="leaflet-bar">
              <a href="#" title="Reset View" onClick={ () => this.fitBounds() }><i className="fa fa-dot-circle-o" ></i></a>
            </Control>
            {list_markers}
          </Map>
        </div>
    );
  }
}

module.exports = SimpleMap;