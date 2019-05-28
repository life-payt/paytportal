import React from 'react';

import SimpleMap from './SimpleMap.jsx';

class GMap extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="box box-success">
              <div className="box-header with-border">
                <h3 className="box-title">{this.props.title}</h3>
              </div>
              <div className="box-body no-padding">
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <div className="pad" style={{width: '100%',height: this.props.height}}>
                      <SimpleMap zoom={this.props.zoom} type={this.props.type} positions={this.props.positions} marker={this.props.marker} marker_name={this.props.marker_name} enable={this.props.enable}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = GMap;