import React from 'react';

class StatTile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var link = '',
        stats = <h3> {this.props.stats} </h3>;

        if(this.props.link) {
            link =
                <a href={this.props.link} className="small-box-footer">
                    More info <i className="fa fa-arrow-circle-right"></i>
                </a>;
        }

        if(this.props.stats.indexOf('%') !== -1) {
            var style = {
                fontSize: '20px'
            };

            stats =
                <h3>
                    {this.props.stats.replace(/%/g, '')}
                    <sup style={style}>%</sup>
                </h3>
        }

        return(
            <div className = {"col-lg-"+this.props.width+" col-md-6 col-xs-6"}>
                <div className={this.props.theme+" small-box"}>
                    <div className="inner">
                        {stats}
                        {this.props.subject}
                    </div>
                    <div className="icon">
                        <i className={"fa "+this.props.icon}></i>
                    </div>
                    {link}
                </div>
            </div>
        )
    }
}

module.exports = StatTile;