import React, { Component } from 'react';
import classNames from 'classnames';
import uuid from 'uuid/v4';

import View from './View';
import Graphics2D from './logic/Graphics2D';

import './index.css';

let Graphics;

const reset = (x, y) => ({ x: x - 260, y: y - 70 });

class Project extends Component {
  state = {
  	activeTab: 0, activeOption: '', currentAction: '', activeElementId:  '',
  	playgroundAngle: '90', playgroundInput: ''
  }

  componentDidMount () {
  	this.resetDimentions();
  	window.onresize = this.resetDimentions;
  	const ctx = document.getElementById('view').getContext('2d');
  	Graphics = new Graphics2D(ctx);
  }

  onInputChange = (onChangeEvent) => {
  	const { target: { id, name = id, value } } = onChangeEvent;
  	this.setState((state) => ({ ...state, [name]: value }));
  }

  resetDimentions = () => {
  	const { innerWidth: WIDTH, innerHeight: HEIGHT } = window;
  	this.setState((state) => ({ ...state, WIDTH: WIDTH - 270, HEIGHT: HEIGHT - 83 }));
  }

  setActiveTab = (activeTab = 0) => this.setState(() => ({ activeTab }))

  setActiveOption = (activeOption = '') => this.setState(() => ({ activeOption }))

  setCurrentAction = (currentAction = '') => this.setState(() => ({ currentAction }))

  updateFollowPoint = (x, y) => this
  	.setState((state) => ({ shapes: { ...state.shapes, followPoint: { x, y } } }))

  onMouseDown = (event) => {
  	const { clientX, clientY } = event;
  	const { x, y } = reset(clientX, clientY);
  	const { activeTab, activeOption } = this.state;
  	const id = uuid();
  	switch (`${activeTab}-${activeOption}`) {
    	case '0-line':
    		Graphics.drawLine(x, y, x, y, id);
    		Graphics.stroke();
    		this.setCurrentAction('draw-p0');
  		break;
  	case '0-rect':
  		Graphics.rect(x, y, x, y, id);
  		Graphics.stroke();
  		this.setCurrentAction('draw-p0');
  		break;
  	case '0-circle':
  		Graphics.arc(x, y, 0, 0, Math.PI * 2, id);
  		Graphics.stroke();
  		this.setCurrentAction('draw-p0');
  		break;
  	case '0-ellipse':
  		Graphics.ellipse(x, y, 0, 0, 0, 0, Math.PI * 2, id);
  		Graphics.stroke();
  		this.setCurrentAction('draw-p0');
  		break;
  	default:
  	}
  	this.setState((state) => ({ ...state, activeElementId: id }));
  }

  onMouseMove = (event) => {
  	const { clientX, clientY } = event;
  	const { x, y } = reset(clientX, clientY);
  	const { activeTab, activeOption, currentAction } = this.state;
  	Graphics.setFollowPoint(x, y);
  	Graphics.fill('black');

  	const { activeElementId: id } = this.state;
  	switch (`${activeTab}-${activeOption}-${currentAction}`) {
  	case '0-line-draw-p0':
  		Graphics.editLine(x, y, id);
  		break;
  	case '0-rect-draw-p0':
  		Graphics.editRect(x, y, id);
  		break;
  	case '0-circle-draw-p0':
  		Graphics.editArc(x, y, id);
  		break;
  	case '0-ellipse-draw-p0':
  		Graphics.editEllipse(x, y, id);
  		break;
  	default:
  	}
  }

  onMouseUp = (event) => {
  	const { clientX, clientY } = event;
  	const { x, y } = reset(clientX, clientY);
  	const { activeTab, activeOption, currentAction } = this.state;
  	switch (`${activeTab}-${activeOption}-${currentAction}`) {
  	case '0-line-draw-p0': this.setCurrentAction(''); break;
  	case '0-rect-draw-p0': this.setCurrentAction(''); break;
  	case '0-circle-draw-p0': this.setCurrentAction(''); break;
  	case '0-ellipse-draw-p0': this.setCurrentAction(''); break;
  	default:
  	}
  }

  drawPlayground = () => {
  	const { playgroundInput, playgroundAngle } = this.state;
  	Graphics.creativePolyline(playgroundInput.toUpperCase(), playgroundAngle);
  }

  update = () => {
  	const { shapes } = this.state;
  	Graphics.update(shapes);
  }

  render () {
  	const { HEIGHT, WIDTH, activeOption, activeTab, playgroundAngle, playgroundInput } = this.state;
  	return (
  		<div className='wrapper'>
  			<div className='tabs'>
  				<ul>
  					<li>
  						<button
  							className={classNames(activeTab === 0 && 'active')}
  							onClick={() => this.setActiveTab(0)}
  						>Paint</button>
  					</li>
  					<li>
  						<button
  							className={classNames(activeTab === 1 && 'active')}
  							onClick={() => this.setActiveTab(1)}
  						>Play with polygons</button>
  					</li>
  					<li>
  						<button
  							className={classNames(activeTab === 2 && 'active')}
  							onClick={() => this.setActiveTab(2)}
  						>Transformations</button>
  					</li>
  				</ul>
  			</div>
  			<div className='options'>
  				{
  					activeTab === 0 ? <ul>
  					<li>
  						<button
  							className={classNames(activeOption === 'line' && 'active')}
  							onClick={() => this.setActiveOption('line')}
  						>
                line
  						</button>
  					</li>
  						<li>
  						<button
  							className={classNames(activeOption === 'rect' && 'active')}
  							onClick={() => this.setActiveOption('rect')}
  						>
                rect
  						</button>
  					</li>
  					<li>
  						<button
  							className={classNames(activeOption === 'circle' && 'active')}
  							onClick={() => this.setActiveOption('circle')}
  						>
                circle
  						</button>
  					</li>
  					<li>
  						<button
  							className={classNames(activeOption === 'ellipse' && 'active')}
  							onClick={() => this.setActiveOption('ellipse')}
  						>
                ellipse
  						</button>
  					</li>
  				</ul> : (
  						<div>
  							<div>
    							<label>Write your moves</label>
    							<input
  									value={playgroundInput}
    								style={{ width: 600 }}
  									name='playgroundInput'
  									onChange={this.onInputChange}
    								placeholder='F: Forward, B: Backward, L: Left, R: Right, \
                    ()^N Repeat whats inside braces N times'
    							/>
  							</div>
  							<div>
    							<label>Set angle for left and right</label>
    							<input
  									name='playgroundAngle'
  									onChange={this.onInputChange}
  									placeholder='90'
  									value={playgroundAngle}
    							/>
  								<button onClick={this.drawPlayground}>Draw</button>
  							</div>
  						</div>
  					)}
  			</div>
  			<View
  				className='view'
  				WIDTH={WIDTH}
  				HEIGHT={HEIGHT}
  				onMouseDown={this.onMouseDown}
  				onMouseUp={this.onMouseUp}
  				onMouseMove={this.onMouseMove}
  			/>
  		</div>
  	);
  }
}

export default Project;
