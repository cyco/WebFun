import { Event, Point } from "src/util";

import { Events } from "./abstract-tool";

declare interface TileChangeEventInitDict extends EventInit {
	affectedPoints: Point[];
}

class TileChangeEvent extends Event {
	public readonly affectedPoints: Point[];

	constructor(eventInitDict?: TileChangeEventInitDict) {
		super(Events.ChangedTiles, eventInitDict);

		this.affectedPoints = (eventInitDict ? eventInitDict.affectedPoints : []) || [];
	}
}

export default TileChangeEvent;
export { TileChangeEvent, TileChangeEventInitDict };
