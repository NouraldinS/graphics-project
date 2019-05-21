import React, { Component } from 'react';

class View extends Component {
	render () {
		const { className, WIDTH, HEIGHT, ...events } = this.props;
		return (
			<div className={className}>
				<canvas width={WIDTH} height={HEIGHT} id='view' {...events}/>
			</div>
		);
	}
}

export default View;
