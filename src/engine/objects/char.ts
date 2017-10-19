import { Direction, Point } from "src/util";
import Type from "./char-type";
import CharFrame from "./char-frame";

export { Type };

class Char {
	private _frames: CharFrame[] = [];
	private _name: string = null;
	private _data: any = null;
	private rawData: any = null;
	private rawAuxData: any = null;
	private rawWeaponData: any = null;
	private _type: number = null;

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

	getFace(direction: number, frameIdx: number): number {
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

	isHero(): boolean {
		return !!(this.type & Type.Hero);
	}

	isEnemy(): boolean {
		return !!(this.type & Type.Enemy);
	}

	isWeapon(): boolean {
		return !!(this.type & Type.Weapon);
	}

	produceBullet(inertia: Point): any {
		return null;
		// TODO: implement shooting
		/*
		 const tile = this._getBullettile(inertia);
		 const tile = window.engine.data.tiles[tile]; // TODO: fix global referene
		 const bullet = new Bullet([tile], inertia);
		 return bullet;
		 */
	}

	_getBullettile(inertia: Point): number {
		const frame = this._frames.first();

		if (inertia.x) return inertia.x === 1 ? frame.right : frame.left;
		else return inertia.y === 1 ? frame.down : frame.up;
	}
}

export default Char;
