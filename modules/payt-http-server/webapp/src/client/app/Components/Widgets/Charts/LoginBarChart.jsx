import React from 'react';
import {render} from 'react-dom';

import {Line,Bar} from 'react-chartjs-2';

var TranslationsStore = require('../../Flux/Stores/TranslationsStore');

/*  Uncomment when ELK running 

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  apiVersion: '6.0'
}); */

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class LoginBarChart extends React.Component {
    constructor(props){
        super(props);

        this._onChange = this._onChange.bind(this);
        this.formatData = this.formatData.bind(this);

        this.state = {
          strings: getAppState(),
          sucCounty:  0,
          failCounty: 0,
          sucUser:    0,
          failUser:   0,
          sucAdmin:   0,
          failAdmin:  0
        };

        /* client.search({
          index: 'filebeat-*',
          body: {
            query: {
              match: {
                action: 'Login',
              }
            },
            size: 100
          }
        }).then(function (resp) {
            this.setVals(resp.hits.hits);
        }.bind(this), function (err) {
            console.trace(err.message);
        }); */
    }

    setVals(logins){
        var sucCountyLogins = logins.filter(login => 
          login['_source']['result'] == 'Success' &&
          login['_source']['role'] == 'county'
        );
        var failCountyLogins = logins.filter(login => 
          login['_source']['result'] == 'Failure' &&
          login['_source']['role'] == 'county'
        );
        var sucUserLogins = logins.filter(login => 
          login['_source']['result'] == 'Success' &&
          login['_source']['role'] == 'user'
        );
        var failUserLogins = logins.filter(login => 
          login['_source']['result'] == 'Failure' &&
          login['_source']['role'] == 'user'
        );
        var sucAdminLogins = logins.filter(login => 
          login['_source']['result'] == 'Success' &&
          login['_source']['role'] == 'admin'
        );
        var failAdminLogins = logins.filter(login => 
          login['_source']['result'] == 'Failure' &&
          login['_source']['role'] == 'admin'
        );

        this.setState({ sucCounty:  sucCountyLogins.length,
                        failCounty: failCountyLogins.length,
                        sucUser:    sucUserLogins.length,
                        failUser:   failUserLogins.length,
                        sucAdmin:   sucAdminLogins.length,
                        failAdmin:  failAdminLogins.length });
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

    formatData() {
        var dataValues = [];
        var dataValues2 = [];
        
        dataValues.push(this.state.sucCounty);
        dataValues.push(this.state.sucUser);
        dataValues.push(this.state.sucAdmin);

        dataValues2.push(this.state.failCounty);
        dataValues2.push(this.state.failUser);
        dataValues2.push(this.state.failAdmin);

        const data = {
          labels: [this.state.strings.LoginBarChart.normal, this.state.strings.LoginBarChart.county, this.state.strings.LoginBarChart.admin],
          datasets: [
            {
              label: this.state.strings.LoginBarChart.approved,
              backgroundColor: 'rgba(0, 166, 90, 0.6)',
              borderColor: 'rgba(0, 166, 90, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(0, 166, 90, 1)',
              hoverBorderColor: 'rgba(0, 166, 90, 1)',
              data: dataValues
            },
            {
              label: this.state.strings.LoginBarChart.denied,
              backgroundColor: 'rgba(221, 75, 57, 0.6)',
              borderColor: 'rgba(221, 75, 57, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(221, 75, 57, 1)',
              hoverBorderColor: 'rgba(221, 75, 57, 1)',
              data: dataValues2
            }
          ]
        };

        return data;
    }

    render() {

        return(
            <div className="box">
              <div className="box-header">
                <i className="fa fa-bar-chart-o"></i>
                <h3 className="box-title">{this.state.strings.LoginBarChart.title}</h3>
              </div>
              <div className="box-body">
                <Bar data={this.formatData} height={540} options={{ maintainAspectRatio: false }}/>
              </div>
            </div>
        );
    }
}

module.exports = LoginBarChart;