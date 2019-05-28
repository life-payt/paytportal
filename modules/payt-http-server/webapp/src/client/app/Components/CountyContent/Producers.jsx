import React from 'react';
import { render } from 'react-dom';

import SimpleMap from '../Widgets/SimpleMap.jsx';
import ContainerTabs from '../Widgets/Containers/ContainerTabs.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class ProducersContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.setState({ strings: getAppState() });
  }

  render() {
    var positions = [[38.720964, -9.153455], [38.736741, -9.121194], [38.726556, -9.170470], [38.749765, -9.152344],
    [38.763590, -9.124271], [38.774258, -9.096291], [38.795634, -9.103109], [38.793403, -9.123276]];

    var pos = [];
    var totLat = 0;
    var totLong = 0;
    var nCont = 0;

    for (var i = 0; i < positions.length; i++) {
      if (positions[i]) {
        pos.push({ id: i, coord: positions[i] });
      }
    }

    /*
    var marker = L.icon({
        iconUrl: '/public/dist/img/factory.png',
        iconSize: [20, 30],
        iconAnchor: [22, 30],
        popupAnchor: [-12, -32],
    });*/

    var marker_name = this.state.strings.MunBusinessSideBar.markerName;

    var tabs = [
      { title: this.state.strings.ProducersContent.map, content: <div style={{ height: 585 }}><SimpleMap zoom={13} type={'factory'} positions={pos} /*center={center} marker={marker}*/ marker_name={this.state.strings.ProducersContent.markerName} enable={true} /></div> },
      //{title: this.state.strings.ProducersContent.table}
    ];

    return (
      <div className="row">
        <div id='producers'>
          <div className="col-lg-12"><ContainerTabs tabs={tabs} /></div>
        </div>
        <section className="col-lg-12">
          <div className="row">
            <div className="col-lg-12" id="detailsProducers"></div>
          </div>
          <div className="row">
            <div className="col-lg-12" id="containersBarChart"></div>
          </div>
        </section>
      </div>
    );
  }
}

module.exports = ProducersContent;