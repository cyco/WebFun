import { Monster } from "src/engine/objects";
import { Point } from "../../util";

class MutableMonster extends Monster {
	get id(): number {
		return this._id;
	}

	set id(id: number) {
		this._id = id;
	}

	get position(): Point {
		return this._position;
	}

	set position(position: Point) {
		this._position = position;
	}

	get loot(): number {
		return this._loot;
	}

	set loot(loot: number) {
		this._loot = loot;
	}

	set dropsLoot(dropsLoot: boolean) {
		this._dropsLoot = dropsLoot;
	}

	get dropsLoot(): boolean {
		return this._dropsLoot;
	}

	get waypoints(): Point[] {
		return this._waypoints;
	}

	set waypoints(waypoints: Point[]) {
		this._waypoints = waypoints;
	}
}

export default MutableMonster;
