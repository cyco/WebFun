import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { HotspotExecutionResult } from "../hotspot-execution-result";

export default (engine: Engine, hotspot: Hotspot): HotspotExecutionResult => {
	const zone = engine.currentZone;
	const { world, sector } = engine.findSectorContainingZone(zone);
	const story = engine.story;

	const tile = zone.getTile(hotspot.x, hotspot.y, Zone.Layer.Object);
	if (!tile) return HotspotExecutionResult.Void;
	if (tile !== sector.npc) return HotspotExecutionResult.Void;

	if (world === engine.dagobah) {
		// TODO: check if bumping Yoda's Seat in the Rescue Yoda storyline causes trouble
		const puzzles = sector.usedAlternateStrain ? story.puzzles[0] : story.puzzles[1];
		const puzzle = puzzles.last();
		console.assert(!!puzzle);

		if (!sector.solved1) {
			const text = puzzle.strings[3];
			const startPuzzle = puzzles.first();
			console.assert(!!startPuzzle);
			engine
				.speak(text, hotspot.location)
				.then(() => engine.dropItem(startPuzzle.item1, hotspot.location))
				.then((): void => void (sector.solved1 = true))
				.then((): void => void (sector.solved2 = true));

			return HotspotExecutionResult.Drop | HotspotExecutionResult.Speak;
		} else {
			const text = puzzle.strings[2];
			engine.speak(text, hotspot.location);

			return HotspotExecutionResult.Speak;
		}
	}

	// default casing bumping SpawnLocation
	const puzzleIndex = sector.puzzleIndex;
	if (puzzleIndex === -1) return HotspotExecutionResult.Void;

	if (!sector.solved1) {
		const puzzles = sector.usedAlternateStrain ? story.puzzles[0] : story.puzzles[1];
		const puzzle1 = puzzles[puzzleIndex];
		console.assert(!!puzzle1);
		const text1 = puzzle1.strings[0];

		const puzzle2 = puzzles[puzzleIndex + 1];
		const text2 = puzzle2.strings[2];

		const text = [text1, text2].join(" ");
		engine.speak(text, hotspot.location);
		return HotspotExecutionResult.Speak;
	} else {
		const puzzles = sector.usedAlternateStrain ? story.puzzles[0] : story.puzzles[1];
		const puzzle = puzzles[puzzleIndex];
		console.assert(!!puzzle);
		const text = puzzle.strings[1];
		engine.speak(text, hotspot.location);
		return HotspotExecutionResult.Speak;
	}

	return HotspotExecutionResult.Void;
};
