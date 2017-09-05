import { Direction } from "src/util";
import Type from "./char-type";

export { Type };

export default class Char {
	constructor() {
		this._frames = [];
		this._name = null;
		this._data = null;

		this.rawData = null;
		this.rawAuxData = null;
		this.rawWeaponData = null;
		this._type = null;
	}

	getFace(direction, frameIdx) {
		if (this.isHero()) {
			frameIdx = frameIdx % 3;
		} else {
			frameIdx = 1 + frameIdx % 2;
		}

		let tile = null;
		let frame = this._frames[frameIdx];

		const dir = Direction.Confine(direction);
		switch (dir) {
			case Direction.NorthEast:
			case Direction.NorthWest:
			case Direction.North:
				tile = frame.up;
				break;
			case Direction.SouthEast:
			case Direction.SouthWest:
			case Direction.South:
				tile = frame.down;
				break;
			case Direction.East:
				tile = frame.right;
				break;
			case Direction.West:
				tile = frame.left;
				break;
		}

		return tile;
	}

	isHero() {
		return this.type & Type.Hero;
	}

	isEnemy() {
		return this.type & Type.Enemy;
	}

	isWeapon() {
		return this.type & Type.Weapon;
	}

	produceBullet(inertia) {
		return null;
		// TODO: implement shooting
		/*
		 const tile = this._getBullettile(inertia);
		 const tile = window.engine.data.tiles[tile]; // TODO: fix global referene
		 const bullet = new Bullet([tile], inertia);
		 return bullet;
		 */
	}

	_getBullettile(inertia) {
		const frame = this._frames.first();

		if (inertia.x) return inertia.x === 1 ? frame.right : frame.left;
		else return inertia.y === 1 ? frame.down : frame.up;
	}

	get frames() {
		return this._frames;
	}

	get name() {
		return this._name;
	}

	get type() {
		return this._type;
	}

	get attackDuration() {
		return 4;
	}
}
