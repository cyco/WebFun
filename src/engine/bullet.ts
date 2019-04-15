import { Point } from "src/util";
import { Char as Weapon } from "./objects";

class Bullet {
	public position: Point;
	public direction: number;
	private _weapon: Weapon;

	constructor(weapon: Weapon) {
		this._weapon = weapon;
	}
}

export default Bullet;
