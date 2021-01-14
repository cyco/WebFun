import CursorManager from "src/app/webfun/input/cursor-manager";
import { Direction } from "src/util";

describe("WebFun.App.Input.CursorManager", () => {
	let subject: CursorManager;
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		subject = new CursorManager(container);
	});

	it("is a class that manages directional cursors on a container", () => {
		expect(CursorManager).toBeAClass();
	});

	it("has an assertion to check for invalid input", () => {
		expect(() => subject.changeCursor(-1)).toThrow();
	});

	describe("setting directional cursors", () => {
		it("East", () => {
			subject.changeCursor(Direction.East);
			expect(container.dataset.cursor).toBe("east");
		});

		it("SouthEast", () => {
			subject.changeCursor(Direction.SouthEast);
			expect(container.dataset.cursor).toBe("south-east");
		});

		it("South", () => {
			subject.changeCursor(Direction.South);
			expect(container.dataset.cursor).toBe("south");
		});

		it("SouthWest", () => {
			subject.changeCursor(Direction.SouthWest);
			expect(container.dataset.cursor).toBe("south-west");
		});

		it("West", () => {
			subject.changeCursor(Direction.West);
			expect(container.dataset.cursor).toBe("west");
		});

		it("NorthWest", () => {
			subject.changeCursor(Direction.NorthWest);
			expect(container.dataset.cursor).toBe("north-west");
		});

		it("North", () => {
			subject.changeCursor(Direction.North);
			expect(container.dataset.cursor).toBe("north");
		});

		it("NorthEast", () => {
			subject.changeCursor(Direction.NorthEast);
			expect(container.dataset.cursor).toBe("north-east");
		});
	});

	describe("setting other cursors", () => {
		it("works by giving the name of the cursor", () => {
			subject.changeCursor("test");
			expect(container.dataset.cursor).toBe("test");
		});
	});

	describe("clearing the cursor", () => {
		it("works by passing in null", () => {
			subject.changeCursor("test");
			subject.changeCursor(null);
			expect(container.dataset.cursor).not.toBe("test");
		});
	});
});
