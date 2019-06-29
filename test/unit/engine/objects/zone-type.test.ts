import ZoneType from "src/engine/objects/zone-type";
import PuzzleType from "src/engine/objects/puzzle-type";

describe("WebFun.Engine.Objects.ZoneType", () => {
	it("is an enum for zone types", () => {
		expect(ZoneType).toBeClass();
	});

	it("can be created from a number", () => {
		expect(ZoneType.fromNumber(0)).toBe(ZoneType.None);
		expect(ZoneType.fromNumber(9999)).toBe(ZoneType.Unknown);
		expect(() => ZoneType.fromNumber(-1)).toThrow();
	});

	it("can be represented as a string", () => {
		expect(ZoneType.None.name).toBe("None");
		expect(ZoneType.Empty.name).toBe("Empty");
		expect(ZoneType.BlockadeNorth.name).toBe("Blockade North");
		expect(ZoneType.BlockadeSouth.name).toBe("Blockade South");
		expect(ZoneType.BlockadeEast.name).toBe("Blockade East");
		expect(ZoneType.BlockadeWest.name).toBe("Blockade West");
		expect(ZoneType.TravelStart.name).toBe("Travel Start");
		expect(ZoneType.TravelEnd.name).toBe("Travel End");
		expect(ZoneType.Room.name).toBe("Room");
		expect(ZoneType.Load.name).toBe("Load");
		expect(ZoneType.Goal.name).toBe("Goal");
		expect(ZoneType.Town.name).toBe("Town");
		expect(ZoneType.UnknownIndyOnly.name).toBe("Unknown (indy)");
		expect(ZoneType.Win.name).toBe("Win");
		expect(ZoneType.Lose.name).toBe("Lose");
		expect(ZoneType.Trade.name).toBe("Trade");
		expect(ZoneType.Use.name).toBe("Use");
		expect(ZoneType.Find.name).toBe("Find");
		expect(ZoneType.Unknown.name).toBe("Unknown");
		expect(ZoneType.FindTheForce.name).toBe("Find The Force");
		expect(ZoneType.FindTheForce.toString()).toBe("ZoneType{FindTheForce}");
	});

	it("can be represented as a number", () => {
		expect(ZoneType.None.rawValue).toBe(0);
		expect(ZoneType.Empty.rawValue).toBe(1);
		expect(ZoneType.BlockadeNorth.rawValue).toBe(2);
		expect(ZoneType.BlockadeSouth.rawValue).toBe(3);
		expect(ZoneType.BlockadeEast.rawValue).toBe(4);
		expect(ZoneType.BlockadeWest.rawValue).toBe(5);
		expect(ZoneType.TravelStart.rawValue).toBe(6);
		expect(ZoneType.TravelEnd.rawValue).toBe(7);
		expect(ZoneType.Room.rawValue).toBe(8);
		expect(ZoneType.Load.rawValue).toBe(9);
		expect(ZoneType.Goal.rawValue).toBe(10);
		expect(ZoneType.Town.rawValue).toBe(11);
		expect(ZoneType.UnknownIndyOnly.rawValue).toBe(12);
		expect(ZoneType.Win.rawValue).toBe(13);
		expect(ZoneType.Lose.rawValue).toBe(14);
		expect(ZoneType.Trade.rawValue).toBe(15);
		expect(ZoneType.Use.rawValue).toBe(16);
		expect(ZoneType.Find.rawValue).toBe(17);
		expect(ZoneType.FindTheForce.rawValue).toBe(18);
		expect(ZoneType.Unknown.rawValue).toBe(9999);
	});

	it("can be converted to a puzzle type", () => {
		expect(ZoneType.Use.toPuzzleType()).toBe(PuzzleType.U1);
		expect(ZoneType.Unknown.toPuzzleType()).toBe(PuzzleType.End);
		expect(ZoneType.Goal.toPuzzleType()).toBe(PuzzleType.U3);
		expect(ZoneType.Trade.toPuzzleType()).toBe(PuzzleType.U2);
		expect(() => ZoneType.Room.toPuzzleType()).toThrow();
	});
});
