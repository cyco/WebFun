import RequiredItems from "src/engine/cheats/required-items";
import { Engine } from "src/engine";
import { Tile } from "src/engine/objects";

describe("WebFun.Engine.Cheats.RequiredItems", () => {
	let subject: RequiredItems;

	beforeEach(() => (subject = new RequiredItems()));

	it("is activated by the code `go3po`", () => {
		expect(subject.code).toEqual("go3po");
	});

	it("show a message!`", () => {
		expect(subject.message).toEqual("It's Dangerous to Go Alone! Take This!");
	});

	it("adds items required to solved the current zone to the inventory", () => {
		const itemMock1: Tile = {} as any;
		const itemMock2: Tile = {} as any;
		const mockEngine: Engine = {
			currentWorld: {
				findSectorContainingZone: () => ({
					requiredItem: itemMock1,
					additionalRequiredItem: itemMock2
				})
			},
			inventory: { addItem: (): void => void 0 }
		} as any;
		spyOn(mockEngine.inventory, "addItem");
		subject.execute(mockEngine);
		expect(mockEngine.inventory.addItem).toHaveBeenCalledWith(itemMock1);
		expect(mockEngine.inventory.addItem).toHaveBeenCalledWith(itemMock2);
	});

	it("adds items required to solved the current zone to the inventory", () => {
		const itemMock1: Tile = {} as any;
		const mockEngine: Engine = {
			currentWorld: {
				findSectorContainingZone: () => ({ findItem: itemMock1 })
			},
			inventory: { addItem: (): void => void 0 }
		} as any;
		spyOn(mockEngine.inventory, "addItem");
		subject.execute(mockEngine);
		expect(mockEngine.inventory.addItem).not.toHaveBeenCalledWith(itemMock1);
	});

	it("does nothing if the hero is off planet", () => {
		const mockEngine: Engine = {
			currentWorld: {
				findSectorContainingZone(): any {
					return null;
				}
			}
		} as any;
		expect(() => subject.execute(mockEngine)).not.toThrow();
	});
});
