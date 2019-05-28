import React from 'react';
import {render} from 'react-dom';

import RowTwoWidgets from '../Widgets/Rows/RowTwoWidgets.jsx';
import RowFourWidgets from '../Widgets/Rows/RowFourWidgets.jsx';
import BarChart from '../Widgets/Charts/BarChart.jsx';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class CountyBusinessContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            strings: getAppState()
        };

        this._onChange = this._onChange.bind(this);
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

    render() {
        var unit = this.state.strings.CountyBusinessContent.unit;

        var values=['38,05'+unit,'35,67'+unit,'5,14'+unit,'15,05'+unit];
        var texts=[this.state.strings.CountyBusinessContent.totalReal,this.state.strings.CountyBusinessContent.totalSimul,"Texto Exemplo 1","Texto Exemplo 2"];
        var icons=["ion ion-cash","ion ion-ios-game-controller-b","fa fa-thumbs-o-up","fa fa-comments-o"];
        var colors=["bg-green","bg-green","bg-green","bg-green"];

        var values1=['9h-10h','5 '+this.state.strings.Months[8],'23-30 '+this.state.strings.Months[8],this.state.strings.Months[8]];
        var texts1=[this.state.strings.CountyBusinessContent.hourPref,this.state.strings.CountyBusinessContent.dayPref,this.state.strings.CountyBusinessContent.weekPref,this.state.strings.CountyBusinessContent.monthPref];
        var icons1=["ion ion-cash","ion ion-ios-game-controller-b","fa fa-thumbs-o-up","fa fa-comments-o"];
        var colors1=["bg-green disabled","bg-green disabled","bg-green disabled","bg-green disabled"];

        var values2=['Empresa X - 1500L','Empresa Y - 1000L','Empresa W - 67%','Empresa Z - 31%'];
        var texts2=[this.state.strings.CountyBusinessContent.highProd,this.state.strings.CountyBusinessContent.lowProd,this.state.strings.CountyBusinessContent.highSep,this.state.strings.CountyBusinessContent.lowSep];
        var icons2=["ion ion-cash","ion ion-ios-game-controller-b","fa fa-thumbs-o-up","fa fa-comments-o"];
        var colors2=["bg-green disabled","bg-green disabled","bg-green disabled","bg-green disabled"];

        return (
            <div>
              <div className="row"><RowTwoWidgets values={values} texts={texts} icons={"","","",""} colors={colors}/></div>
              <div className="row"><RowFourWidgets enable={false} values={values2} texts={texts2} icons={"","","",""} colors={colors2}/></div>
              <div className="row"><section className="col-lg-12" ><BarChart type="waste"/></section></div>
            </div>
        );
    }
}

module.exports = CountyBusinessContent;