import { Point, Rectangle, Size } from "src/util";
import WorldItem from "./world-item";

class World {
	private _world: WorldItem[];
	public readonly bounds: Rectangle;

	constructor(size = new Size(10, 10)) {
		this.bounds = new Rectangle(new Point(0, 0), size);
		this._world = new Array(size.area).fill(new WorldItem());
	}

	get size(): Size {
		return this.bounds.size;
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
		if (!this.bounds.contains(p))
			throw new RangeError(`Index ${p} does not lie within rect ${this.bounds}`);

		return p.y * 10 + p.x;
	}

	public map<T>(callback: (_: WorldItem, idx: number) => T) {
		return this._world.map(callback);
	}
}

export default World;
