import React from 'react';

class InfoBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className = {"col-md-"+this.props.width+" col-sm-6 col-xs-12"}>
                <div className={"info-box "+this.props.theme}>
                    <span className="info-box-icon">
                        <i className={this.props.icon}></i>
                    </span>

                    <div className="info-box-content">
                        <span className="info-box-text">{this.props.subject}</span>
                        <span className="info-box-number">{this.props.stats}</span>
                        {this.props.children}
                    </div>
                    
                    {this.props.content}
                </div>
            </div>
      );
    }
}

module.exports = InfoBox;