import Direction from "/util/direction";

export const Type = {
	Hero: 0x0001,
	Enemy: 0x0002,
	Weapon: 0x0004
};

export default class Char {
	constructor() {}

	getFace(direction, frameIdx) {
		if (this.isHero()) {
			frameIdx = frameIdx % 3;
		} else {
			frameIdx = 1 + frameIdx % 2;
		}

		let tileID = 0xFFFF;
		let frame = this._frames[frameIdx];

		const dir = Direction.Confine(direction);
		switch (dir) {
			case Direction.NorthEast:
			case Direction.NorthWest:
			case Direction.North:
				tileID = frame.up;
				break;
			case Direction.SouthEast:
			case Direction.SouthWest:
			case Direction.South:
				tileID = frame.down;
				break;
			case Direction.East:
				tileID = frame.right;
				break;
			case Direction.West:
				tileID = frame.left;
				break;
		}

		return this._tileStore[tileID];
	}

	get frames() {
		return this._frames;
	}

	get name() {
		return this._name;
	}

	get type() {
		return this._data[1] << 8 | this._data[0];
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

	get attackDuration() {
		return 4;
	}

	produceBullet(inertia) {
		const tileID = this._getBulletTileID(inertia);
		const tile = window.engine.data.tiles[tileID]; // TODO: fix global referene
		const bullet = new Bullet([tile], inertia);
		return bullet;
	}

	_getBulletTileID(inertia) {
		const frame = this._frames.first();

		if (inertia.x) return inertia.x === 1 ? frame.right : frame.left;
		else return inertia.y === 1 ? frame.down : frame.up;
	}
}
