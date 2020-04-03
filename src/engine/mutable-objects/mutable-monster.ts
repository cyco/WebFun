import { Monster } from "src/engine/objects";

class MutableMonster extends Monster {
	get id() {
		return this._id;
	}

	set id(id) {
		this._id = id;
	}

	get position() {
		return this._position;
	}

	set position(position) {
		this._position = position;
	}

	get loot() {
		return this._loot;
	}

	set loot(loot) {
		this._loot = loot;
	}

	set dropsLoot(dropsLoot) {
		this._dropsLoot = dropsLoot;
	}

	get dropsLoot() {
		return this._dropsLoot;
	}

	get waypoints() {
		return this._waypoints;
	}

	set waypoints(waypoints) {
		this._waypoints = waypoints;
	}
}

export default MutableMonster;
