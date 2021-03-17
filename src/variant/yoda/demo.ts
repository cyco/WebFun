import Yoda from "./yoda";

import { Puzzle, Zone } from "src/engine/objects";
import { Engine, Story } from "src/engine";
import { WorldSize } from "src/engine/generation";
import { rand } from "src/util";
import { MutableZone } from "src/engine/mutable-objects";
import GoalIDs from "./goal-ids";

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
