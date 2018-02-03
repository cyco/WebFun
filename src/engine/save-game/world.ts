import { Point, Rectangle, Size } from "../../util";
import WorldItem from "./world-item";

class World {
	_world: WorldItem[];
	_bounds: Rectangle;

	constructor(size = new Size(10, 10)) {
		this._bounds = new Rectangle(new Point(0, 0), size);
		this._world = new Array(size.area).fill(new WorldItem());
	}

	get size(): Size {
		return this._bounds.size;
	}

	setWorldItem(x: number, y: number, item: WorldItem): void {
		const index = this._toIndex(new Point(x, y));
		this._world[index] = item;
	}

	getWorldItem(x: number, y: number): WorldItem {
		const index = this._toIndex(new Point(x, y));
		return this._world[index];
	}

	_toIndex(p: Point): number {
		if (!this._bounds.contains(p)) throw new RangeError(`Index ${p} does not lie within rect ${this._bounds}`);

		return p.y * 10 + p.x;
	}
}

export default World;
