import { Point, EventTarget } from '/util';
import { Hero, Inventory } from '/engine';

export default class GameSate extends EventTarget {
	constructor() {
		super();

		this.currentZone = null;
		this.worldLocation = {
			x: 11,
			y: 11
		};

		this._worlds = [];
		this._ending = null;
		this._inventory = new Inventory();
		this._hero = new Hero();
		this.justEntered = true;
		this.enteredByPlane = false;
		this.bump = null;
		this.viewOffset = new Point(0, 0);

		Object.seal(this);
	}

	get worlds() {
		return this._worlds;
	}

	get hero() {
		return this._hero;
	}

	get ending() {
		return this._ending;
	}

	get inventory() {
		return this._inventory;
	}
}
