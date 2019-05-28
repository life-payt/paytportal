import React from 'react';
import { render } from 'react-dom';
import Dropzone from 'react-dropzone';
import { ProgressBar } from 'react-bootstrap';
var TranslationsStore = require('../Flux/Stores/TranslationsStore');

// Method to retrieve application state from store
function getAppState() {
	return TranslationsStore.getStrings();
}

class DropWidget extends React.Component {
	constructor(props) {
		super();
		this.state = { 
			files: [], 
			strings: getAppState(),
			progress: 0,
			uploading: false 
		};
		this._onChange = this._onChange.bind(this);
	}

	updateProgress(e){
		var prog = Math.floor(e.loaded / e.total * 100);
		console.log(Math.floor(e.loaded / e.total *100) + '%');
		if(prog == 100)
			this.setState({uploading: false});
		else
			this.setState({progress: prog});
	}

	onDrop(files) {
		this.setState({
			files
		});

		window.payt_session.call('payt.' + window.county + '.upload.private.' + this.props.type + '_update', {
			callback: function (d) {
				var data = new FormData();

				data.append('token', d.token);
				data.append('file', files[0]);

				this.setState({progress: 0, uploading: true});

				jQuery.ajax({
					url: '/upload/' + d.resource,
					xhr: function() {
						var xhr = $.ajaxSettings.xhr();
						xhr.upload.onprogress = function(e) {
							this.updateProgress(e);
						}.bind(this);
						return xhr;
					}.bind(this),
					data: data,
					cache: false,
					contentType: false,
					processData: false,
					method: 'POST',
					type: 'POST',
					success: function (data) {
						if (data === 'success') {
							console.log('Uploaded file');
						}
						else {
							console.log('Error uploading file');
						}
					}
				});
			}.bind(this),
			exchange: window.county
		});
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
		this.setState({ strings: getAppState() });
	}

	render() {
		return (
			<div className="box box-success">
				<div className="box-header with-border">
					<h3 className="box-title">{this.state.strings.DropWidget.title[this.props.type]}</h3>
				</div>
				<div className="box-body no-padding">
					<Dropzone className="dropwidget" multiple={false} disabled={this.state.uploading} style={this.state.uploading ? {opacity: 0.5}:{}} onDrop={this.onDrop.bind(this)}>
						<img src="/public/dist/img/upload.png" />
						<p>{this.state.strings.DropWidget.uploadHint}</p>
					</Dropzone>
					{this.state.uploading ?
						<div style={{margin: '5%'}}>
							<p style={{textAlign: 'center'}}>{this.state.strings.DropWidget.uploading}</p> 
							<ProgressBar active bsStyle="success" now={this.state.progress} label={`${this.state.progress} %`}/>
						</div>
						: 
						null
					}
				</div>
			</div>
		);
	}
}

module.exports = DropWidget;