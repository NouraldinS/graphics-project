import { parseCreativeInput } from '../../helpers';

const { PI } = Math;

const toDeg = (rad) => rad * 180 / PI;

const toRad = (deg) => deg / 180 * PI;

export default class Graphics2D {
  shapes = {
  	arcs: {},
  	lines: {},
  	points: {},
  	polygons: {},
  	polylines: {},
  	followPoint: null
  }

  constructor (ctx) {
  	this.ctx = ctx;
  	this.update();
  }

  drawPoint = (x, y, color, id) => {
  	this.shapes.points[id] = { x, y, color };
  }

  drawLine = (x1, y1, x2, y2, id) => {
  	this.shapes.lines[id] = { x1, y1, x2, y2 };
  }

  editLine = (x2, y2, id) => {
  	if (!this.shapes.lines[id]) throw new Error(`id: ${id} is not found in shapes.lines`);
  	this.shapes.lines[id] = { ...this.shapes.lines[id], x2, y2 };
  }

  arc = (cx, cy, r, startAngle, endAngle, id) => {
  	this.ellipse(cx, cy, r, r, 0, startAngle, endAngle, id);
  }

  editArc = (x2, y2, id) => {
  	if (!this.shapes.arcs[id]) throw new Error(`id: ${id} is not found in shapes.arcs`);
  	const { cx, cy } = this.shapes.arcs[id];
  	const r = ((cx - x2) ** 2 + (cy - y2) ** 2) ** 0.5;
  	this.shapes.arcs[id].rx = r;
  	this.shapes.arcs[id].ry = r;
  }

  ellipse = (cx, cy, rx, ry, rotation, startAngle, endAngle, id) => {
  	this.shapes.arcs[id] = { cx, cy, rx, ry, rotation, startAngle, endAngle };
  }

  editEllipse = (x2, y2, id) => {
  	if (!this.shapes.arcs[id]) throw new Error(`id: ${id} is not found in shapes.arcs`);
  	const { cx, cy } = this.shapes.arcs[id];
  	const dx = x2 - cx;
  	const dy = y2 - cy;
  	this.shapes.arcs[id].rx = Math.abs(dx);
  	this.shapes.arcs[id].ry = Math.abs(dy);
  }

  rect = (x1, y1, x2, y2, id) => {
  	this.shapes.polygons[id] = [
  		{ x1, y1, x2, y2: y1 },
  		{ x2, y1, x1: x2, y2 },
  		{ x2: x1, y2, x1: x2, y1: y2 }
  	];
  }

  editRect = (x2, y2, id) => {
  	if (!this.shapes.polygons[id]) throw new Error(`id: ${id} is not found in shapes.polygons`);
  	const [v1, v2, v3] = this.shapes.polygons[id];
  	this.shapes.polygons[id][0] = { ...v1, x2 };
  	this.shapes.polygons[id][1] = { ...v2, x1: x2, y2, x2 };
  	this.shapes.polygons[id][2] = { ...v3, x1: x2, y1: y2, y2 };
  }

  star = (x1, y1, x2, y2, r1, r2, p, id) => {
  	if (!id) throw new Error('id is required');
  	if (isNaN(p) || p < 3) throw new Error('p param is a number greater than 2');
  	this.shapes.polygons[id] = [];
  }

  creativePolyline = (input, angle) => {
  	const rad = toRad(angle);
  	const { ctx } = this;
  	parseCreativeInput(input)
  		.then((path) => {
  			path = typeof path === 'string' ? path : path[0];
  			ctx.resetTransform();
  			ctx.translate(300, 300);
  			ctx.moveTo(0, 0);
  			const stepLength = 150;
  			console.log('path', path);

  			path.split('').forEach((char) => {
  				ctx.strokeWidth = 50;
  				ctx.strokeStyle = 'red';
  				switch (char) {
  				case 'F':
  					ctx.save();
  					ctx.arc(0, 0, 5, 0, 2 * Math.PI);
  					ctx.lineTo(stepLength, 0);
  					ctx.stroke();
  					ctx.restore();
  					ctx.translate(stepLength, 0);
  					break;
  				case 'B':
  					ctx.save();
  					ctx.lineTo(-stepLength, 0);
  					ctx.stroke();
  					ctx.restore();
  					ctx.translate(-stepLength, 0);
  					break;
  				case 'L':
  					ctx.rotate(-rad);
  					break;
  				case 'R':
  					ctx.rotate(rad);
  					break;
  				default:
  				}
  			});
  		});
  }

  followPointArc = (cx, cy, r, startAngle, endAngle) => {
  	const { ctx } = this;
  	ctx.arc(cx, cy, r, startAngle, endAngle);
  	ctx.stroke();
  }

  stroke = (style) => {
  	const { ctx } = this;
  	if (style) ctx.strokeStyle = style;
  	ctx.stroke();
  }

  fill = (style) => {
  	const { ctx } = this;
  	if (style) ctx.fillStyle = style;
  	ctx.fill();
  }

  setFollowPoint = (x, y) => {
  	if (x && y) this.shapes.followPoint = { x, y };
  	else this.shapes.followPoint = null;
  }

  updateAllLines = () => {
  	// this.shapes.lines.forEach(line => )
  }

  update = () => {
  	const { shapes, ctx } = this;
  	ctx.clearRect(0, 0, 10000, 10000);
  	ctx.beginPath();
  	for (const shape in shapes) {
  		switch (shape) {
  		case 'followPoint':
  			const point = shapes.followPoint;
  			if (point) {
  				ctx.beginPath();
  				this.followPointArc(point.x, point.y, 5, 0, 2 * PI);
  				this.fill('#3e3e3e');
  				ctx.closePath();
  			}
  			break;
  		case 'lines':
  			Object.values(shapes.lines).forEach((line) => {
  				const { x1, x2, y1, y2, color = '#000' } = line;
  				ctx.beginPath();
  				ctx.moveTo(x1, y1);
  				ctx.lineTo(x2, y2);
  				ctx.strokeStyle = color;
  				ctx.stroke();
  				ctx.closePath();
  			});
  			break;
  		case 'polygons':
  			Object.values(shapes.polygons).forEach((polygon) => {
  				ctx.strokeStyle = '#000';
  				polygon.forEach((vertex) => {
  					ctx.beginPath();
  					ctx.moveTo(vertex.x1, vertex.y1);
  					ctx.lineTo(vertex.x2, vertex.y2);
  					ctx.stroke();
  				});
  				ctx.lineTo(polygon[0].x1, polygon[0].y1);
  				ctx.stroke();
  			});
  			break;
  		case 'arcs':
  			Object.values(shapes.arcs).forEach((arc) => {
  				ctx.strokeStyle = '#000';
  				const { cx, cy, rx, ry, rotation, startAngle, endAngle } = arc;
  				ctx.beginPath();
  				ctx.ellipse(cx, cy, rx, ry, rotation, startAngle, endAngle);
  				ctx.stroke();
  				ctx.closePath();
  			});
  			break;
  		default:

  		}
  	}
  	requestAnimationFrame(this.update);
  }
}
