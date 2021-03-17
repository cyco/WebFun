import { Char, Puzzle, Tile, Zone } from "src/engine/objects";

import LocatorTile from "./locator-tile";
import Sounds from "./sounds";
import Strings from "./strings";
import Animations from "./animations";
import CharIDs from "./char-ids";
import GoalIDs from "./goal-ids";
import ZoneIDs from "./zone-ids";
import TileIDs from "./tile-ids";
import { Variant, Engine, Story } from "src/engine";
import { WorldSize } from "src/engine/generation";
import { Point, rand } from "src/util";
import { MutableZone } from "src/engine/mutable-objects";
import { SaveState } from "src/engine/save-game";

import Yoda from "./yoda";

class YodaDemo extends Yoda {
	public createNewStory(engine: Engine): Story {
		const goal = engine.assets.get(Puzzle, GoalIDs.HIDDEN_FACTORY);
		engine.assets
			.getFiltered(
				Zone,
				zone =>
					zone.type === Zone.Type.Goal &&
					(!zone.providedItems.includes(goal.item1) || !zone.providedItems.includes(goal.item2))
			)
			.forEach(z => ((z as MutableZone).type = Zone.Type.None));

		return new Story(
			rand(),
			Zone.Planet.Hoth,
			[WorldSize.Small, WorldSize.Medium, WorldSize.Large].random()
		);
	}
}

export default YodaDemo;
