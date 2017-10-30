import { Tile } from "src/engine/objects";

class Quest {
	public item: Tile;
	public distance: number;

	constructor(item: Tile, distance: number) {
		this.item = item;
		this.distance = distance;
	}

}

export default Quest;
