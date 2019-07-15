import { moveCheck, MoveCheckResult } from "src/engine/npc-move/helpers";
import { Point, Size } from "src/util";
import { Zone, Tile } from "src/engine/objects";

describe("WebFun.Engine.NPCMove.Helpers.MoveCheck", () => {
	let mockedZone: Zone;
	const start = new Point(5, 5);
	beforeEach(() => {
		mockedZone = mockZone();
		(window as any).engine = { metronome: { tickCount: 0 } };
	});

	afterEach(() => {
		delete (window as any).engine;
	});

	it("checks if an npc can be moved into a specific direction", () => {
		expect(moveCheck).toBeFunction();
	});

	it("returns OutOfBounds if the npc would leave the zone", () => {
		expect(moveCheck(new Point(0, 0), new Point(0, -1), mockedZone, false)).toBe(
			MoveCheckResult.OutOfBounds
		);
		expect(moveCheck(new Point(0, 0), new Point(-1, 0), mockedZone, false)).toBe(
			MoveCheckResult.OutOfBounds
		);
		expect(moveCheck(new Point(0, 0), new Point(-1, -1), mockedZone, false)).toBe(
			MoveCheckResult.OutOfBounds
		);
		expect(moveCheck(new Point(8, 8), new Point(0, 1), mockedZone, false)).toBe(
			MoveCheckResult.OutOfBounds
		);
		expect(moveCheck(new Point(8, 8), new Point(1, 0), mockedZone, false)).toBe(
			MoveCheckResult.OutOfBounds
		);
		expect(moveCheck(new Point(8, 8), new Point(1, 1), mockedZone, false)).toBe(
			MoveCheckResult.OutOfBounds
		);
	});

	it("suggest evading up when moving left against an obstacle", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 4 && y === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(-1, 0), mockedZone, false)).toBe(MoveCheckResult.EvadeUp);
	});

	it("suggest evading down when moving left against an obstacle and tick count is odd", () => {
		(window as any).engine.metronome.tickCount = 1;

		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 4 && y === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(-1, 0), mockedZone, false)).toBe(MoveCheckResult.EvadeDown);
	});

	it("suggest evading down when moving left against an obstacle and the one above is blocked", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 4 && y === 5) return ({} as any) as Tile;
			if (x === 4 && y === 4) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(-1, 0), mockedZone, false)).toBe(MoveCheckResult.EvadeDown);
	});

	it("suggest evading up when moving left against an obstacle, at odd tick counts and the one below is blocked", () => {
		(window as any).engine.metronome.tickCount = 1;

		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 4 && y === 6) return ({} as any) as Tile;
			if (x === 4 && y === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(-1, 0), mockedZone, false)).toBe(MoveCheckResult.EvadeUp);
	});

	it("returns blocked when moving left against an obstacle there's no way around it", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 4 && y === 6) return ({} as any) as Tile;
			if (x === 4 && y === 5) return ({} as any) as Tile;
			if (x === 4 && y === 4) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(-1, 0), mockedZone, false)).toBe(MoveCheckResult.Blocked);
	});

	it("suggest evading up when moving right against an obstacle", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 6 && y === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(1, 0), mockedZone, false)).toBe(MoveCheckResult.EvadeUp);
	});

	it("suggest evading down when moving right against an obstacle and tick count is odd", () => {
		(window as any).engine.metronome.tickCount = 1;

		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 6 && y === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(1, 0), mockedZone, false)).toBe(MoveCheckResult.EvadeDown);
	});

	it("suggest evading down when moving right against an obstacle and the one above is blocked", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 6 && y === 5) return ({} as any) as Tile;
			if (x === 6 && y === 4) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(1, 0), mockedZone, false)).toBe(MoveCheckResult.EvadeDown);
	});

	it("suggest evading up when moving right against an obstacle, at odd tick counts and the one below is blocked", () => {
		(window as any).engine.metronome.tickCount = 1;

		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 6 && y === 6) return ({} as any) as Tile;
			if (x === 6 && y === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(1, 0), mockedZone, false)).toBe(MoveCheckResult.EvadeUp);
	});

	it("returns blocked when moving right against an obstacle there's no way around it", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (x === 6 && y === 6) return ({} as any) as Tile;
			if (x === 6 && y === 5) return ({} as any) as Tile;
			if (x === 6 && y === 4) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(1, 0), mockedZone, false)).toBe(MoveCheckResult.Blocked);
	});

	it("suggest evading right when moving down against an obstacle", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 6 && x === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, 1), mockedZone, false)).toBe(MoveCheckResult.EvadeLeft);
	});

	it("suggest evading left when moving down against an obstacle and tick count is odd", () => {
		(window as any).engine.metronome.tickCount = 1;

		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 6 && x === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, 1), mockedZone, false)).toBe(MoveCheckResult.EvadeRight);
	});

	it("suggest evading left when moving down against an obstacle and the one above is blocked", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 6 && x === 5) return ({} as any) as Tile;
			if (y === 6 && x === 4) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, 1), mockedZone, false)).toBe(MoveCheckResult.EvadeRight);
	});

	it("suggest evading right when moving down against an obstacle, at odd tick counts and the one below is blocked", () => {
		(window as any).engine.metronome.tickCount = 1;

		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 6 && x === 6) return ({} as any) as Tile;
			if (y === 6 && x === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, 1), mockedZone, false)).toBe(MoveCheckResult.EvadeLeft);
	});

	it("returns blocked when moving down against an obstacle there's no way around it", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 6 && x === 6) return ({} as any) as Tile;
			if (y === 6 && x === 5) return ({} as any) as Tile;
			if (y === 6 && x === 4) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, 1), mockedZone, false)).toBe(MoveCheckResult.Blocked);
	});

	it("suggest evading right when moving up against an obstacle", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 4 && x === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, -1), mockedZone, false)).toBe(MoveCheckResult.EvadeLeft);
	});

	it("suggest evading left when moving up against an obstacle and tick count is odd", () => {
		(window as any).engine.metronome.tickCount = 1;

		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 4 && x === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, -1), mockedZone, false)).toBe(MoveCheckResult.EvadeRight);
	});

	it("suggest evading left when moving up against an obstacle and the one above is blocked", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 4 && x === 5) return ({} as any) as Tile;
			if (y === 4 && x === 4) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, -1), mockedZone, false)).toBe(MoveCheckResult.EvadeRight);
	});

	it("suggest evading right when moving up against an obstacle, at odd tick counts and the one below is blocked", () => {
		(window as any).engine.metronome.tickCount = 1;

		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 4 && x === 6) return ({} as any) as Tile;
			if (y === 4 && x === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, -1), mockedZone, false)).toBe(MoveCheckResult.EvadeLeft);
	});

	it("returns blocked when moving up against an obstacle there's no way around it", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 4 && x === 6) return ({} as any) as Tile;
			if (y === 4 && x === 5) return ({} as any) as Tile;
			if (y === 4 && x === 4) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(0, -1), mockedZone, false)).toBe(MoveCheckResult.Blocked);
	});

	it("returns blocked when moving diagonally into a corner", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 4 && x === 4) return ({} as any) as Tile;
			if (y === 4 && x === 5) return ({} as any) as Tile;
			if (y === 5 && x === 4) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(-1, -1), mockedZone, false)).toBe(MoveCheckResult.Blocked);
	});

	it("returns blocked when moving diagonally into a corner", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 5 && x === 6) return ({} as any) as Tile;
			if (y === 6 && x === 6) return ({} as any) as Tile;
			if (y === 6 && x === 5) return ({} as any) as Tile;
			return null;
		});
		expect(moveCheck(start, new Point(1, 1), mockedZone, false)).toBe(MoveCheckResult.Blocked);
	});

	it("evades right when moving diagonally into a wall on the left", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 4 && x === 4) return ({} as any) as Tile;
			if (y === 5 && x === 4) return ({} as any) as Tile;
			return null;
		});

		expect(moveCheck(start, new Point(-1, -1), mockedZone, false)).toBe(MoveCheckResult.EvadeRight);
	});

	it("suggests evading down when moving diagonally into a wall on the top", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 4 && x === 4) return ({} as any) as Tile;
			if (y === 4 && x === 5) return ({} as any) as Tile;
			return null;
		});

		expect(moveCheck(start, new Point(-1, -1), mockedZone, false)).toBe(MoveCheckResult.EvadeDown);
	});

	it("evades left when moving diagonally into a wall on the right", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 5 && x === 6) return ({} as any) as Tile;
			if (y === 6 && x === 6) return ({} as any) as Tile;
			return null;
		});

		expect(moveCheck(start, new Point(1, 1), mockedZone, false)).toBe(MoveCheckResult.EvadeLeft);
	});

	it("suggests evading up when moving diagonally into a wall on the bottom", () => {
		spyOn(mockedZone, "getTile").and.callFake((x, y) => {
			if (y === 6 && x === 5) return ({} as any) as Tile;
			if (y === 6 && x === 6) return ({} as any) as Tile;
			return null;
		});

		expect(moveCheck(start, new Point(1, 1), mockedZone, false)).toBe(MoveCheckResult.EvadeUp);
	});

	it("returns Free if there's no tile at the object layer", () => {
		spyOn(mockedZone, "getTile").and.returnValue(null);
		expect(moveCheck(new Point(4, 4), new Point(1, 1), mockedZone, false)).toBe(MoveCheckResult.Free);
		expect(mockedZone.getTile).toHaveBeenCalledWith(5, 5, Zone.Layer.Object);
	});

	function mockZone() {
		return ({ size: new Size(9, 9), getTile: (): void => void 0 } as unknown) as Zone;
	}
});
