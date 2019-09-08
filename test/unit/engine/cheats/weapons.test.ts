import { Yoda } from "src/engine/type";
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
			assetManager: new AssetManager()
		};

		mockEngine.assetManager.set(Tile, (0x1a5 as any) as Tile, 0x1a5);
		mockEngine.assetManager.set(Tile, (0x1ff as any) as Tile, 0x1ff);
		mockEngine.assetManager.set(Tile, (0x200 as any) as Tile, 0x200);
		mockEngine.assetManager.set(Tile, (0x201 as any) as Tile, 0x201);
		mockEngine.assetManager.set(Tile, (0x202 as any) as Tile, 0x202);

		subject.execute((mockEngine as any) as Engine);

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
