import { Yoda } from "src/variant";
import Weapons from "src/engine/cheats/weapons";
import { Tile } from "src/engine/objects";
import { AssetManager, Engine } from "src/engine";

describe("WebFun.Engine.Cheats.Weapons", () => {
	let subject: Weapons;
	beforeEach(() => (subject = new Weapons()));

	it("is activated by the code `gojedi`", () => {
		expect(subject.code).toEqual("gojedi");
	});

	it("show the message `Super Jedi!`", () => {
		expect(subject.message).toEqual("Super Jedi!");
	});

	it("gives the hero a couple of items when executed", () => {
		const items: any[] = [];
		const mockEngine = {
			inventory: { addItem: (item: any) => items.push(item) },
			assets: new AssetManager()
		};

		mockEngine.assets.set(Tile, 421 as any as Tile, 421);
		mockEngine.assets.set(Tile, 511 as any as Tile, 511);
		mockEngine.assets.set(Tile, 512 as any as Tile, 512);
		mockEngine.assets.set(Tile, 513 as any as Tile, 513);
		mockEngine.assets.set(Tile, 514 as any as Tile, 514);

		subject.execute(mockEngine as any as Engine);

		expect(items).toEqual([
			Yoda.tileIDs.ThermalDetonator,
			Yoda.tileIDs.ThermalDetonator,
			Yoda.tileIDs.ThermalDetonator,
			Yoda.tileIDs.ThermalDetonator,
			Yoda.tileIDs.ThermalDetonator,
			Yoda.tileIDs.BlasterRifle,
			Yoda.tileIDs.Blaster,
			Yoda.tileIDs.TheForce
		]);
	});
});
