import { Point, Rectangle, Size } from "src/util";

import Sector from "./sector";

class World {
	private _world: Sector[];
	public readonly bounds: Rectangle;

	constructor(size = new Size(10, 10)) {
		this.bounds = new Rectangle(new Point(0, 0), size);
		this._world = new Array(size.area).fill(new Sector());
	}

	get size(): Size {
		return this.bounds.size;
	}

	setSector(x: number, y: number, item: Sector): void {
		const index = this._toIndex(new Point(x, y));
		this._world[index] = item;
	}

	getSector(x: number, y: number): Sector {
		const index = this._toIndex(new Point(x, y));
		return this._world[index];
	}

	private _toIndex(p: Point): number {
		if (!this.bounds.contains(p))
			throw new RangeError(`Index ${p} does not lie within rect ${this.bounds}`);

		return p.y * 10 + p.x;
	}

	public map<T>(callback: (_: Sector, idx: number) => T) {
		return this._world.map(callback);
	}
}

export default World;
