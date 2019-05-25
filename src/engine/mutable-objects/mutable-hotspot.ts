import { Hotspot } from "src/engine/objects";
import { Point } from "src/util";

class MutableHotspot extends Hotspot {
	get location() {
		return new Point(this.x, this.y);
	}
	set location(l) {
		this.x = l.x;
		this.y = l.y;
	}
}

export default MutableHotspot;
