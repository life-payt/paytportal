import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';

var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
  return TranslationsStore.getStrings();
}

class MunSideBar extends React.Component {
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
            <li className="header">{this.state.strings.MunSideBar.mainMenu}</li>
            <li className={this.props.location.pathname.includes("/county/gstats") ? 'active' : ''}>
              <Link to={{ pathname: '/county/gstats', state: { title: this.state.strings.MunSideBar.generalStats } }}>
                <i className="fa fa-chart-pie"></i> <span>{this.state.strings.MunSideBar.generalStats}</span>
              </Link>
            </li>
            <li className={this.props.location.pathname.includes("/county/containers") ? 'active' : ''}>
              <Link to={{ pathname: '/county/containers', state: { title: this.state.strings.MunSideBar.containers } }}>
                <i className="fa fa-trash"></i> <span>{this.state.strings.MunSideBar.containers}</span>
              </Link>
            </li>
            <li className={this.props.location.pathname.includes("/county/users") ? 'active' : ''}>
              <Link to={{ pathname: '/county/users', state: { title: this.state.strings.MunSideBar.users } }}>
                <i className="fa fa-users"></i> <span>{this.state.strings.MunSideBar.users}</span>
              </Link>
            </li>
            <li className={this.props.location.pathname.includes("/county/cards") ? 'active' : ''}>
              <Link to={{ pathname: '/county/cards', state: { title: this.state.strings.MunSideBar.cards } }}>
                <i className="fa fa-id-card"></i> <span>{this.state.strings.MunSideBar.cards}</span>
              </Link>
            </li>
            <li className={this.props.location.pathname.includes("/county/upload") ? 'active' : ''}>
              <Link to={{ pathname: '/county/upload', state: { title: this.state.strings.MunSideBar.upload } }}>
                <i className="fa fa-cloud-upload-alt"></i> <span>{this.state.strings.MunSideBar.upload}</span>
              </Link>
            </li>
            <li className={this.props.location.pathname.includes("/county/settings") ? 'active' : ''}>
              <Link to={{ pathname: '/county/settings', state: { title: this.state.strings.MunSideBar.settings } }}>
                <i className="fa fa-gears"></i> <span>{this.state.strings.MunSideBar.settings}</span>
              </Link>
            </li>
            <li>
              <a href='https://manual.life-payt.eu/pt'>
                <i className="fa fa-question-circle"></i> <span>{this.state.strings.MunSideBar.help}</span>
              </a>
            </li>
          </ul>
        </section>
      </aside>
    );
  }
}

module.exports = MunSideBar;