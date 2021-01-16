import { Hotspot } from "src/engine/objects";
import { Point } from "src/util";

class MutableHotspot extends Hotspot {
	get location(): Point {
		return new Point(this.x, this.y);
	}
	set location(l: Point) {
		this.x = l.x;
		this.y = l.y;
	}
}

export default MutableHotspot;
