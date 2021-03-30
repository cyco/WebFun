import * as Util from "src/util";
import score, {
	CalculateScoreBasedOnTime,
	CalculateScoreBasedOnVisitedSectors,
	CalculateScoreBasedOnDifficulty,
	CalculateScoreBasedOnSolvedPuzzles
} from "src/engine/score";
import { Engine } from "src/engine";
import Settings from "src/settings";
import { WorldSize } from "src/engine/generation";

describe("WebFun.Engine.Score", () => {
	let engine: Engine;
	beforeEach(() => (engine = mockEngine()));

	describe("total score", () => {
		it("returns the maximum score if every zone in the largest world is solved in no time at the hardest difficulty", () => {
			expect(totalScore(WorldSize.Small, 0, 10, 10, 5, 5, 100)).toBe(1000);
		});

		it("adds a random number if the score is not already at 1000", () => {
			spyOn(Util, "rand").and.returnValue(8);
			expect(totalScore(WorldSize.Small, 0, 9, 10, 5, 5, 100)).toBe(998);
			expect(Util.rand).toHaveBeenCalled();
		});

		function totalScore(
			size: WorldSize,
			totalPlayTime: number,
			sectorsVisited: number,
			sectorsTotal: number,
			puzzlesSolved: number,
			puzzlesTotal: number,
			difficulty: number
		): number {
			(engine.story as any).size = size;
			(engine.story as any).puzzles = Array.Repeat({}, puzzlesTotal);
			engine.totalPlayTime = 0;
			engine.currentPlayStart = new Date(new Date().getTime() - totalPlayTime * 1000);
			engine.settings = { difficulty: difficulty } as any;

			const sectors = Array.Repeat({ zone: null }, 100) as any[];
			for (let i = 0; i < sectorsTotal; i++) {
				sectors[i] = Object.assign({}, sectors[i]);
				sectors[i].zone = {};
				sectors[i].visited = i < sectorsVisited;
				sectors[i].solved1 = i < puzzlesSolved;
				sectors[i].solved2 = i < puzzlesSolved;
			}
			(engine.world as any).sectors = sectors;

			return score(engine);
		}
	});

	describe("score based on play time", () => {
		it("returns full score if a small world is solved in less than 5 minutes", () => {
			expect(score(60, 4 * 60, WorldSize.Small)).toEqual(200);
			expect(score(0, 5 * 60, WorldSize.Small)).toEqual(200);
			expect(score(0, 4 * 60, WorldSize.Small)).toEqual(200);
			expect(score(0, 3 * 60, WorldSize.Small)).toEqual(200);
			expect(score(0, 2 * 60, WorldSize.Small)).toEqual(200);
			expect(score(0, 1 * 60, WorldSize.Small)).toEqual(200);
			expect(score(0, 0, WorldSize.Small)).toEqual(200);
			expect(score(-1, 0, WorldSize.Small)).toEqual(200);
		});

		it("returns full score if a medium world is solved in less than 10 minutes", () => {
			expect(score(60, 9 * 60, WorldSize.Medium)).toEqual(200);
			expect(score(0, 10 * 60, WorldSize.Medium)).toEqual(200);
			expect(score(6 * 60, 4 * 60, WorldSize.Medium)).toEqual(200);
			expect(score(0, 0, WorldSize.Medium)).toEqual(200);
			expect(score(60, 60, WorldSize.Medium)).toEqual(200);
			expect(score(-1, 0, WorldSize.Medium)).toEqual(200);
		});

		it("returns full score if a large world is solved in less than 15 minutes", () => {
			expect(score(60, 14 * 60, WorldSize.Large)).toEqual(200);
			expect(score(0, 15 * 60, WorldSize.Large)).toEqual(200);
			expect(score(6 * 60, 4 * 60, WorldSize.Large)).toEqual(200);
			expect(score(0, 0, WorldSize.Large)).toEqual(200);
			expect(score(60, 60, WorldSize.Large)).toEqual(200);
			expect(score(-1, 0, WorldSize.Large)).toEqual(200);
		});

		it("subtracts 20 points from the full score for every additional minute", () => {
			expect(score(5 * 60, 0 * 60, WorldSize.Small)).toEqual(200);
			expect(score(5 * 60, 50, WorldSize.Small)).toEqual(200);
			expect(score(5 * 60, 59, WorldSize.Small)).toEqual(200);
			expect(score(5 * 60, 1 * 60, WorldSize.Small)).toEqual(180);
			expect(score(5 * 60, 2 * 60, WorldSize.Small)).toEqual(160);
			expect(score(5 * 60, 3 * 60, WorldSize.Small)).toEqual(140);
			expect(score(5 * 60, 4 * 60, WorldSize.Small)).toEqual(120);
			expect(score(5 * 60, 5 * 60, WorldSize.Small)).toEqual(100);
			expect(score(5 * 60, 6 * 60, WorldSize.Small)).toEqual(80);
			expect(score(5 * 60, 7 * 60, WorldSize.Small)).toEqual(60);
			expect(score(5 * 60, 8 * 60, WorldSize.Small)).toEqual(40);
			expect(score(5 * 60, 9 * 60, WorldSize.Small)).toEqual(20);
			expect(score(5 * 60, 10 * 60, WorldSize.Small)).toEqual(0);
			expect(score(5 * 60, 1, WorldSize.Small)).toEqual(200);

			expect(score(10 * 60, 0 * 60, WorldSize.Medium)).toEqual(200);
			expect(score(10 * 60, 50, WorldSize.Medium)).toEqual(200);
			expect(score(10 * 60, 59, WorldSize.Medium)).toEqual(200);
			expect(score(10 * 60, 1 * 60, WorldSize.Medium)).toEqual(180);
			expect(score(10 * 60, 2 * 60, WorldSize.Medium)).toEqual(160);
			expect(score(10 * 60, 3 * 60, WorldSize.Medium)).toEqual(140);
			expect(score(10 * 60, 4 * 60, WorldSize.Medium)).toEqual(120);
			expect(score(10 * 60, 5 * 60, WorldSize.Medium)).toEqual(100);
			expect(score(10 * 60, 6 * 60, WorldSize.Medium)).toEqual(80);
			expect(score(10 * 60, 7 * 60, WorldSize.Medium)).toEqual(60);
			expect(score(10 * 60, 8 * 60, WorldSize.Medium)).toEqual(40);
			expect(score(10 * 60, 9 * 60, WorldSize.Medium)).toEqual(20);
			expect(score(10 * 60, 10 * 60, WorldSize.Medium)).toEqual(0);

			expect(score(15 * 60, 0 * 60, WorldSize.Large)).toEqual(200);
			expect(score(15 * 60, 50, WorldSize.Large)).toEqual(200);
			expect(score(15 * 60, 59, WorldSize.Large)).toEqual(200);
			expect(score(15 * 60, 1 * 60, WorldSize.Large)).toEqual(180);
			expect(score(15 * 60, 2 * 60, WorldSize.Large)).toEqual(160);
			expect(score(15 * 60, 3 * 60, WorldSize.Large)).toEqual(140);
			expect(score(15 * 60, 4 * 60, WorldSize.Large)).toEqual(120);
			expect(score(15 * 60, 5 * 60, WorldSize.Large)).toEqual(100);
			expect(score(15 * 60, 6 * 60, WorldSize.Large)).toEqual(80);
			expect(score(15 * 60, 7 * 60, WorldSize.Large)).toEqual(60);
			expect(score(15 * 60, 8 * 60, WorldSize.Large)).toEqual(40);
			expect(score(15 * 60, 9 * 60, WorldSize.Large)).toEqual(20);
			expect(score(15 * 60, 10 * 60, WorldSize.Large)).toEqual(0);
		});

		it("does not give negative points", () => {
			expect(score(10000, 0, WorldSize.Small)).toEqual(0);
			expect(score(10000, 10000, WorldSize.Small)).toEqual(0);
			expect(score(0, 10000, WorldSize.Small)).toEqual(0);

			expect(score(15 * 60, 15 * 60, WorldSize.Large)).toEqual(0);
		});

		function score(currentPlayTime: number, previousPlayTime: number, size: WorldSize) {
			(engine.story as any).size = size;
			engine.totalPlayTime = previousPlayTime;
			engine.currentPlayStart = new Date(new Date().getTime() - currentPlayTime * 1000);

			return CalculateScoreBasedOnTime(engine);
		}
	});

	describe("score based on visited sectors", () => {
		it("gives 100 points if every sector has been visited", () => {
			expect(score(10, 10)).toBe(100);
			expect(score(50, 50)).toBe(100);
		});

		it("gives 100 points if more than 90% of the sectors have been visited", () => {
			expect(score(48, 50)).toBe(100);
			expect(score(49, 50)).toBe(100);
			expect(score(91, 100)).toBe(100);
			expect(score(98, 100)).toBe(100);
			expect(score(99, 100)).toBe(100);
		});

		it("gives 90 points if more than 80% of the sectors have been visited", () => {
			expect(score(81, 100)).toBe(90);
			expect(score(89, 100)).toBe(90);
			expect(score(90, 100)).toBe(90);
		});

		it("gives 80 points if more than 70% of the sectors have been visited", () => {
			expect(score(71, 100)).toBe(80);
			expect(score(79, 100)).toBe(80);
			expect(score(80, 100)).toBe(80);
		});

		it("gives 70 points if more than 60% of the sectors have been visited", () => {
			expect(score(61, 100)).toBe(70);
			expect(score(69, 100)).toBe(70);
			expect(score(70, 100)).toBe(70);
		});

		it("gives 60 points if more than 50% of the sectors have been visited", () => {
			expect(score(51, 100)).toBe(60);
			expect(score(59, 100)).toBe(60);
			expect(score(60, 100)).toBe(60);
		});

		it("gives 50 points if more than 40% of the sectors have been visited", () => {
			expect(score(41, 100)).toBe(50);
			expect(score(49, 100)).toBe(50);
			expect(score(50, 100)).toBe(50);
		});

		it("gives 40 points if more than 30% of the sectors have been visited", () => {
			expect(score(31, 100)).toBe(40);
			expect(score(39, 100)).toBe(40);
			expect(score(40, 100)).toBe(40);
		});

		it("gives 30 points if more than 20% of the sectors have been visited", () => {
			expect(score(21, 100)).toBe(30);
			expect(score(29, 100)).toBe(30);
			expect(score(30, 100)).toBe(30);
		});

		it("gives 20 points if more than 10% of the sectors have been visited", () => {
			expect(score(11, 100)).toBe(20);
			expect(score(19, 100)).toBe(20);
			expect(score(20, 100)).toBe(20);
		});

		it("gives a minimum of 10 points", () => {
			expect(score(10, 100)).toBe(10);
			expect(score(1, 100)).toBe(10);
			expect(score(0, 100)).toBe(10);
			expect(score(0, 40)).toBe(10);
		});

		it("gives the appropriate amount of points for real numbers", () => {
			expect(score(5, 10)).toBe(50);
			expect(score(23, 40)).toBe(60);
			expect(score(23, 42)).toBe(60);
			expect(score(12, 15)).toBe(80);
		});

		function score(visitedCount: number, totalCount: number): number {
			(engine.world as any).sectors = Array.Repeat({ zone: {}, visited: true }, visitedCount)
				.concat(Array.Repeat({ zone: {}, visited: false }, totalCount - visitedCount))
				.concat(Array.Repeat({ zone: null, visited: false }, 100 - totalCount));

			return CalculateScoreBasedOnVisitedSectors(engine);
		}
	});

	describe("score based on difficulty", () => {
		it("gives at least 40 points", () => {
			expect(score(0)).toBe(40);
			expect(score(1)).toBe(40);
			expect(score(1.5)).toBe(40);
			expect(score(4)).toBe(40);
			expect(score(7)).toBe(40);
			expect(score(9)).toBe(40);
			expect(score(10)).toBe(40);
		});

		it("gives 80 points if difficulty is above 10", () => {
			expect(score(11)).toBe(80);
			expect(score(20)).toBe(80);
		});

		it("gives 120 points if difficulty is above 20", () => {
			expect(score(21)).toBe(120);
			expect(score(30)).toBe(120);
		});

		it("gives 160 points if difficulty is above 30", () => {
			expect(score(31)).toBe(160);
			expect(score(40)).toBe(160);
		});

		it("gives 200 points if difficulty is above 40", () => {
			expect(score(41)).toBe(200);
			expect(score(50)).toBe(200);
		});

		it("gives 240 points if difficulty is above 50", () => {
			expect(score(51)).toBe(240);
			expect(score(60)).toBe(240);
		});

		it("gives 280 points if difficulty is above 60", () => {
			expect(score(61)).toBe(280);
			expect(score(70)).toBe(280);
		});

		it("gives 320 points if difficulty is above 70", () => {
			expect(score(71)).toBe(320);
			expect(score(80)).toBe(320);
		});

		it("gives 360 points if difficulty is above 80", () => {
			expect(score(81)).toBe(360);
			expect(score(90)).toBe(360);
		});

		it("gives 400 points if difficulty is above 90", () => {
			expect(score(91)).toBe(400);
			expect(score(99)).toBe(400);
			expect(score(100)).toBe(400);
		});

		it("returns 0 if the value is out of range", () => {
			expect(score(-1)).toBe(0);
			expect(score(101)).toBe(0);
		});

		function score(number: number) {
			return CalculateScoreBasedOnDifficulty({
				settings: { difficulty: number }
			} as any);
		}
	});

	describe("score based on solved puzzles", () => {
		it("gives 300 points if every sector has been solved", () => {
			expect(score(10, 10)).toBe(300);
			expect(score(50, 50)).toBe(300);
		});

		it("gives 300 points if more than 90% of the sectors have been solved", () => {
			expect(score(48, 50)).toBe(300);
			expect(score(49, 50)).toBe(300);
			expect(score(91, 100)).toBe(300);
			expect(score(98, 100)).toBe(300);
			expect(score(99, 100)).toBe(300);
		});

		it("gives 270 points if more than 80% of the sectors have been solved", () => {
			expect(score(81, 100)).toBe(270);
			expect(score(89, 100)).toBe(270);
			expect(score(90, 100)).toBe(270);
		});

		it("gives 240 points if more than 70% of the sectors have been solved", () => {
			expect(score(71, 100)).toBe(240);
			expect(score(79, 100)).toBe(240);
			expect(score(80, 100)).toBe(240);
		});

		it("gives 210 points if more than 60% of the sectors have been solved", () => {
			expect(score(61, 100)).toBe(210);
			expect(score(69, 100)).toBe(210);
			expect(score(70, 100)).toBe(210);
		});

		it("gives 180 points if more than 50% of the sectors have been solved", () => {
			expect(score(51, 100)).toBe(180);
			expect(score(59, 100)).toBe(180);
			expect(score(60, 100)).toBe(180);
		});

		it("gives 150 points if more than 40% of the sectors have been solved", () => {
			expect(score(41, 100)).toBe(150);
			expect(score(49, 100)).toBe(150);
			expect(score(50, 100)).toBe(150);
		});

		it("gives 120 points if more than 30% of the sectors have been solved", () => {
			expect(score(31, 100)).toBe(120);
			expect(score(39, 100)).toBe(120);
			expect(score(40, 100)).toBe(120);
		});

		it("gives 90 points if more than 20% of the sectors have been solved", () => {
			expect(score(21, 100)).toBe(90);
			expect(score(29, 100)).toBe(90);
			expect(score(30, 100)).toBe(90);
		});

		it("gives 60 points if more than 10% of the sectors have been solved", () => {
			expect(score(11, 100)).toBe(60);
			expect(score(19, 100)).toBe(60);
			expect(score(20, 100)).toBe(60);
		});

		it("gives a minimum of 30 points", () => {
			expect(score(10, 100)).toBe(30);
			expect(score(1, 100)).toBe(30);
			expect(score(0, 100)).toBe(30);
			expect(score(0, 40)).toBe(30);
		});

		it("gives the appropriate amount of points for real numbers", () => {
			expect(score(5, 10)).toBe(150);
			expect(score(23, 40)).toBe(180);
			expect(score(23, 42)).toBe(180);
			expect(score(12, 15)).toBe(240);
		});

		function score(solvedCount: number, totalCount: number): number {
			(engine.world as any).sectors = Array.Repeat(
				{ zone: {}, solved1: true, solved2: true },
				solvedCount
			).concat(Array.Repeat({ zone: null, solved1: false, solved2: false }, 100 - solvedCount));

			(engine.story as any).puzzles = Array.Repeat({}, totalCount);
			return CalculateScoreBasedOnSolvedPuzzles(engine);
		}
	});

	function mockEngine(): Engine {
		return { story: {}, world: {} } as any;
	}
});
