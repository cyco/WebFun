import AssetManager from "src/engine/asset-manager";
import Character from "src/engine/objects/character";

describe("Character", () => {
	let assets: AssetManager;

	beforeEach(() => {
		assets = new AssetManager();
	});

	it("is a class representing character specification", () => {
		const char = new Character(
			3,
			{
				name: "",
				type: Character.Type.Enemy.rawValue,
				movementType: Character.MovementType.None.rawValue,
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
		expect(char instanceof Character).toBeTrue();
	});
});
