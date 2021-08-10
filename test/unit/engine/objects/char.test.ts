import AssetManager from "src/engine/asset-manager";
import Char from "src/engine/objects/char";

describe("Char", () => {
	let assets: AssetManager;

	beforeEach(() => {
		assets = new AssetManager();
	});

	it("is a class representing character specification", () => {
		const char = new Char(
			3,
			{
				name: "",
				type: Char.Type.Enemy.rawValue,
				movementType: Char.MovementType.None.rawValue,
				probablyGarbage1: -1,
				probablyGarbage2: -2,
				frame1: new Int16Array(),
				frame2: new Int16Array(),
				frame3: new Int16Array(),
				damage: 0,
				health: 0,
				reference: -1
			},
			assets
		);
		expect(char instanceof Char).toBeTrue();
	});
});
