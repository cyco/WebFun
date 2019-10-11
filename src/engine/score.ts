import Engine from "./engine";
import { rand, clamp } from "src/util";
import Settings from "src/settings";
import { ceil, floor } from "src/std/math";

const CalculateScoreBasedOnTime = (engine: Engine) => {
	const time =
		engine.temporaryState.totalPlayTime +
		(new Date().getTime() - engine.temporaryState.currentPlayStart.getTime()) / 1000;
	const expectedPlaytime = 5 * engine.story.size.rawValue;
	const actualPlaytime = floor(time / 60);
	const overtime = actualPlaytime - expectedPlaytime;

	return clamp(0, 200 - 20 * overtime, 200);
};

const CalculateScoreBasedOnVisitedSectors = (engine: Engine) => {
	const totalSectors = engine.world.sectors.filter(s => s.zone).length;
	const visitedSectors = engine.world.sectors.filter(s => s.zone && s.visited).length;

	return clamp(10, ceil((visitedSectors / totalSectors) * 10) * 10, 100);
};

const CalculateScoreBasedOnDifficulty = (_: Engine) => {
	const difficulty = Settings.difficulty;
	if (difficulty < 0 || difficulty > 100) return 0;

	return clamp(1, ceil(difficulty / 10), 10) * 40;
};

const CalculateScoreBasedOnSolvedPuzzles = (engine: Engine) => {
	const sum = engine.world.sectors.filter(s => s.zone && s.solved1 && s.solved2).length;
	const ratio = sum / engine.story.puzzles.length;

	return clamp(10, ceil(ratio * 10) * 10, 100) * 3;
};

export default (engine: Engine): number => {
	let score =
		CalculateScoreBasedOnTime(engine) +
		CalculateScoreBasedOnVisitedSectors(engine) +
		CalculateScoreBasedOnDifficulty(engine) +
		CalculateScoreBasedOnSolvedPuzzles(engine);

	if (score < 1000) score += rand() % 9;

	return clamp(0, score, 1000);
};

export {
	CalculateScoreBasedOnTime,
	CalculateScoreBasedOnVisitedSectors,
	CalculateScoreBasedOnDifficulty,
	CalculateScoreBasedOnSolvedPuzzles
};
