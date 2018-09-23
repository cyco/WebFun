import UndoOperation from "src/ux/undo-operation";

describe("WebFun.UX.UndoOperation", () => {
	it("is a simple container for an operation that can be undone", () => {
		let x = 7;
		let subject = new UndoOperation(() => (x = 5), () => (x = 7));

		subject.undo();
		expect(x).toBe(5);

		subject.redo();
		expect(x).toBe(7);
	});
});
