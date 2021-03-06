import { Point, Size } from "src/util";

import Hero from "./hero";

class Camera {
	public zoneSize: Size = new Size(9, 9);
	public hero: Hero = null;
	private _offset: Point = new Point(0, 0);
	private _size: Size = new Size(9, 9);

	get offset(): Point {
		return this._offset;
	}

	get size(): Size {
		return this._size;
	}

	update(_: number): void {
		// center
		this._offset.x = this._size.width / 2.0 - this.hero.location.x;
		this._offset.y = this._size.height / 2.0 - this.hero.location.y;

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
}

export default Camera;
