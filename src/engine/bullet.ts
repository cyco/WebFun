import { Point } from "src/util";
import { Tile } from "src/engine/objects";

class Bullet {
	public position: Point;
	public direction: number;
	public tile: Tile;
}

export default Bullet;
