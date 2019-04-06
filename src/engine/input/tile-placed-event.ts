import { Point } from "src/util";
import { Tile } from "../objects";

const EventName = "tileplaced";

class TilePlacedEvent extends Event {
	public readonly location: Point;
	public readonly item: Tile;

	constructor(item: Tile, location: Point) {
		super(EventName);

		this.item = item;
		this.location = location;
	}
}

export default TilePlacedEvent;
