import { Point } from "/util";

export default class Camera {
	constructor() {
		this._offset = new Point(0, 0);
		this._size = {
			width: 9,
			height: 9
		};

		this.zoneSize = {
			width: 9,
			height: 9
		};

		this.hero = null;

		Object.seal(this);
	}

	update( /*timeDelta*/ ) {
		// center
		this._offset.x = (this._size.width / 2.0) - this.hero.location.x;
		this._offset.y = (this._size.height / 2.0) - this.hero.location.y;

		// be digital
		this._offset.x = Math.floor(this._offset.x);
		this._offset.y = Math.floor(this._offset.y);

		// make sure not to scroll over the border
		// left, bottom
		this._offset.x = Math.min(0, this._offset.x);
		this._offset.y = Math.min(0, this._offset.y);

		// top, right
		this._offset.x = Math.max(this._offset.x, this._size.width - this.zoneSize.width);
		this._offset.y = Math.max(this._offset.y, this._size.height - this.zoneSize.height);
	}

	get offset() {
		return this._offset;
	}

	get size() {
		return this._size;
	}
}
