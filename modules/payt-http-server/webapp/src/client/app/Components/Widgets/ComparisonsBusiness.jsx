import React from 'react';

import SelfComparisons from './SelfComparisons.jsx';
import CustomTabs from './CustomTabs.jsx';
import SBarChart from './Charts/SBarChart.jsx';
import DoughnutChart from './Charts/DoughnutChart.jsx';

var UserInfoStore = require('../Flux/Stores/UserInfoStore');

function getParty() {
	return UserInfoStore.getUserInfo().partyAct;
}

class ComparisonsBusiness extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            party: getParty(),
            id: props.match.url.split('/')[3].split('-')[0],
            selfAvg: 0,
            regAvg: 0,
        }

        window.payt_session.call('payt.'+window.county+'.db.private.get_producer_day_average', {args: [this.state.party.producers[this.state.id].id], 
            callback: function (res){
                if(res != null)
                    this.setSelfAvg(res['TOTAL']);
            }.bind(this),
            exchange: window.county
        });

        window.payt_session.call('payt.'+window.county+'.db.private.get_producer_zone_day_average', {args: [this.state.party.producers[this.state.id].id], 
            callback: function (res){
                if(res != null)
                    this.setRegAvg(res['TOTAL']);
            }.bind(this),
            exchange: window.county
        });
    }

    setSelfAvg(avg){
        if(avg != null){
            this.setState({ selfAvg: avg});
        }
    }

    setRegAvg(avg){
        if(avg != null){
            this.setState({ regAvg: avg });
        }
    }

    render() {
        var month = moment().subtract(1, 'month').month();
        
        return(
          <div>
            <div className="row">
              <div id="compSelf"><SelfComparisons value1={ this.state.selfAvg.toFixed(0) } value2={ this.state.regAvg.toFixed(0) } month={month} /></div>
            </div>
            <div className="row">
              <div id="compTabs" className="col-lg-4"><CustomTabs producer_id={this.state.id}/></div>
              <div id="compLC1" className="col-lg-4"><SBarChart producer_id={this.state.id}/></div>
              <div id="compLC2" className="col-lg-4"><DoughnutChart producer_id={this.state.id}/></div>
            </div>
          </div>
        );
    }
}

module.exports = ComparisonsBusiness;