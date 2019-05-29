import RequiredItems from "src/engine/cheats/required-items";

describe("WebFun.Engine.Cheats.RequiredItems", () => {
	let subject;
	beforeEach(() => (subject = new RequiredItems()));

	it("is activated by the code `go3po`", () => {
		expect(subject.code).toEqual("go3po");
	});

	it("show a message!`", () => {
		expect(subject.message).toEqual("It's Dangerous to Go Alone! Take This!");
	});

	it("adds items required to solved the current zone to the inventory", () => {
		const itemMock1 = {};
		const itemMock2 = {};
		const mockEngine = {
			currentWorld: {
				locationOfZone: () => true,
				at: () => ({ requiredItem: itemMock1, additionalRequiredItem: itemMock2 })
			},
			inventory: { addItem: () => void 0 }
		};
		spyOn(mockEngine.inventory, "addItem");
		subject.execute(mockEngine);
		expect(mockEngine.inventory.addItem).toHaveBeenCalledWith(itemMock1);
		expect(mockEngine.inventory.addItem).toHaveBeenCalledWith(itemMock2);
	});

	it("adds items required to solved the current zone to the inventory", () => {
		const itemMock1 = {};
		const mockEngine = {
			currentWorld: {
				locationOfZone: () => true,
				at: () => ({ findItem: itemMock1 })
			},
			inventory: { addItem: () => void 0 }
		};
		spyOn(mockEngine.inventory, "addItem");
		subject.execute(mockEngine);
		expect(mockEngine.inventory.addItem).not.toHaveBeenCalledWith(itemMock1);
	});

	it("does nothing if the hero is off planet", () => {
		const mockEngine = {
			currentWorld: {
				locationOfZone() {
					return false;
				}
			}
		};
		expect(() => subject.execute(mockEngine)).not.toThrow();
	});
});
