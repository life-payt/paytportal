import React from 'react';
import {render} from 'react-dom';

import * as NotificationsActions from '../Flux/Actions/NotificationsActions';

class Notification extends React.Component {
    constructor(props){
        super(props);

        this.state = {closed: false};
    }

    componentDidMount() {
        setTimeout(() => {
            NotificationsActions.removeNotification();
        }, 5000);
    }

    close() {
        this.setState({closed: true});
    }

    render() {
        var opts = {};

        if(this.state.closed)
            opts = {display: 'none'};

        return(
            <div className={'alert alert-' + this.props.type +' alert-dismissible notification'} style={opts}>
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true" onClick={this.close.bind(this)}>×</button>
                {this.props.text}
            </div>
        );
    }
}

module.exports = Notification;