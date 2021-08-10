import AssetManager from "src/engine/asset-manager";
import { Tile } from "src/engine/objects";
import Puzzle from "src/engine/objects/puzzle";

describe("WebFun.Engine.Objects.Puzzle", () => {
	let assets: AssetManager;
	let subject: Puzzle;

	beforeEach(() => {
		assets = new AssetManager();
		assets.populate(Tile, []);

		subject = new Puzzle(
			4,
			{
				type: Puzzle.Type.None.rawValue,
				item1: -1,
				item1Class: Puzzle.ItemClass.None.rawValue,
				item2: -1,
				item2Class: Puzzle.ItemClass.None.rawValue,
				texts: ["", "", "", "", ""],
				unknown3: 0
			},
			assets
		);
	});

	it("has default values", () => {
		expect(subject.id).toBe(4);
		expect(subject.item1).toBeNull();
		expect(subject.item2).toBeNull();
		expect(subject.strings).toEqual(["", "", "", "", ""]);
		expect(subject.name).toBe("");
		expect(subject.type).toEqual(Puzzle.Type.None);
		expect(subject.item1Class).toBe(Puzzle.ItemClass.None);
		expect(subject.item2Class).toBe(Puzzle.ItemClass.None);
		expect(subject.unknown3).toEqual(0);
	});
});
