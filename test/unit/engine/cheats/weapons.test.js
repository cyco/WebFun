import WeaponsCheat from "src/engine/cheats/weapons";
import { Yoda } from "src/engine";

describe("WeaponsCheat", () => {
	let subject;
	beforeEach(() => subject = new WeaponsCheat());

	it("is activated by the code `gojedi`", () => {
		expect(subject.code).toEqual("gojedi");
	});

	it("show the message `Super Jedi!`", () => {
		expect(subject.message).toEqual("Super Jedi!");
	});

	it("gives the hero a couple of items when executed", () => {
		const items = [];
		const mockEngine = {
			state: {inventory: {addItem: (item) => items.push(item)}},
			data: {
				tiles: {
					0x1A5: 0x1A5,
					0x1FF: 0x1FF,
					0x200: 0x200,
					0x201: 0x201,
					0x202: 0x202
				}
			}
		};
		subject.execute(mockEngine);

		expect(items).toEqual([
			Yoda.ItemIDs.ThermalDetonator,
			Yoda.ItemIDs.ThermalDetonator,
			Yoda.ItemIDs.ThermalDetonator,
			Yoda.ItemIDs.ThermalDetonator,
			Yoda.ItemIDs.ThermalDetonator,
			Yoda.ItemIDs.BlasterRifle,
			Yoda.ItemIDs.Blaster,
			Yoda.ItemIDs.TheForce
		]);
	});
});
