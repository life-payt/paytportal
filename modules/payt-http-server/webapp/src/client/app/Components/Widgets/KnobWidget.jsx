import React from 'react';
import {render} from 'react-dom';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class KnobWidget extends React.Component{
    constructor(props){
        super(props);
        this._onChange = this._onChange.bind(this);
        this.createKnob = this.createKnob.bind(this);
        this.state = {strings:getAppState()};
    }

    componentDidMount(){
      TranslationsStore.addChangeListener(this._onChange);
      this.createKnob();
    }

    componentDidUpdate(){
      var unit = this.state.strings.KnobWidget.unit;
      
      this.createKnob();
      $('#knob_1').val(this.props.value).trigger('change');
      $('#knob_1').trigger('configure', {
          'format': function (v) {
              return v + ' ' + unit;
          }
      }).trigger('change');
    }

    // Unbind change listener
    componentWillUnmount() {
      TranslationsStore.removeChangeListener(this._onChange);
    }

    _onChange() {
      this.setState({strings:getAppState()});
    }

    createKnob(){
      var state = this.state;

      $(function () {
        $("#knob_1").knob({
          format: function (v) {
            return v + ' ' +state.strings.KnobWidget.unit;
          },
          draw: function () {
            // "tron" case
            if (this.$.data('skin') == 'tron') {

              var a = this.angle(this.cv)  // Angle
                  , sa = this.startAngle          // Previous start angle
                  , sat = this.startAngle         // Start angle
                  , ea                            // Previous end angle
                  , eat = sat + a                 // End angle
                  , r = true;

              var color;
              var value = this.$.val(); 

              this.g.lineWidth = this.lineWidth;

              if(value <= 800)
                color="#19A903";
              else if(value > 800 && value <= 1600 )
                color="#71B802";
              else if(value > 1600 && value <= 2400 )
                color="#C7B801";
              else if(value > 2400 && value <= 3200 )
                color="#D66200";
              else
                color="#E50002"; 

              this.o.cursor
              && (sat = eat - 0.3)
              && (eat = eat + 0.3);

              if (this.o.displayPrevious) {
                ea = this.startAngle + this.angle(this.value);
                this.o.cursor
                && (sa = ea - 0.3)
                && (ea = ea + 0.3);
                this.g.beginPath();
                this.g.strokeStyle = color;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                this.g.stroke();
              }

              this.g.beginPath();
              this.g.strokeStyle = r ? color : color;
              this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
              this.g.stroke();

              this.g.lineWidth = 2;
              this.g.beginPath();
              this.g.strokeStyle = color;
              this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
              this.g.stroke();

              this.$.css({
                'color': color,
                'font-size': '16px'
              });

              return false;
            }
          }
        });
        /* END JQUERY KNOB */

    });
    }

    render() {
        var max;

        if(this.props.type=='citizen')
          max = '255';
        else
          max = '4000';

        return(
            <div>
                <input id = {'knob_' + this.props.id} readOnly="readonly" type="text" className="knob" value={this.props.value} data-skin="tron" data-width="170" data-height="170" data-readonly="true" data-max={max} data-thickness=".2"></input>
                <div className="knob-label">{this.props.label}</div>
            </div>
        );
    }
}

module.exports = KnobWidget;