import React from 'react';
import {render} from 'react-dom';

class ContentHeader extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <section className="content-header">
			    <h1>
			        {this.props.title}
			        {/*<small>{this.state.strings.Content.controlPanel}</small>*/}
			    </h1>
                {/*
			    <ol className="breadcrumb">
			        <li><a href="#"><i className="fa fa-dashboard"></i> {this.state.strings.Content.controlPanel}</a></li>
			        <li className="active">{this.props.title}</li>
                </ol>*/}
			</section>
        );
    }
}

module.exports = ContentHeader;