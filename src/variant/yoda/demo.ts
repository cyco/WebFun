import Yoda from "./yoda";

import { Puzzle, Zone } from "src/engine/objects";
import { Engine, Story } from "src/engine";
import { WorldSize } from "src/engine/generation";
import { rand } from "src/util";
import GoalIDs from "./goal-ids";

class YodaDemo extends Yoda {
	public createNewStory(engine: Engine): Story {
		const size = engine.settings.worldSize;

		const goal = engine.assets.get(Puzzle, GoalIDs.HIDDEN_FACTORY);
		engine.assets
			.getFiltered(
				Zone,
				zone =>
					zone.type === Zone.Type.Goal &&
					(!zone.providedItems.includes(goal.item1) || !zone.providedItems.includes(goal.item2))
			)
			.forEach(z => ((z as Zone).type = Zone.Type.None));

		const story = new Story(engine.assets, engine.variant);
		story.generate(
			rand(),
			Zone.Planet.Hoth,
			WorldSize.isWorldSize(size)
				? WorldSize.fromNumber(size)
				: [WorldSize.Small, WorldSize.Medium, WorldSize.Large].random()
		);
		return story;
	}
}

export default YodaDemo;
