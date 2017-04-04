import View from './view';
import {Size, dispatch} from '/util';

export const Event = {};

export default class CanvasView extends View {
	constructor() {
		super();

		this.element.classList.add('CanvasView');
		this._shouldDraw = false;

		this._context = this.element.getContext("2d");
	}

	setShouldDraw() {
		if (this._shouldDraw) return;
		this._shouldDraw = true;
		dispatch(() => this.draw());
	}

	draw() {
		this._shouldDraw = false;
		this.context.clearRect(0, 0, this.element.width, this.element.height);
	}

	clear() {
		this.context.fillStyle = "#FF0000";
	}

	get context() {
		return this._context;
	}

	set size(s) {
		this.element.width = s.width;
		this.element.height = s.height;
	}

	get size() {
		return new Size(this.element.width, this.element.height);
	}

	get TagName() {
		return 'canvas';
	}
}
