import UndoOperation from "src/ux/undo-operation";
import UndoBatchOperation from "src/ux/undo-batch-operation";

describe("WebFun.UX.UndoBatchOperation", () => {
	it("is a simple container that batches undo operations", () => {
		let x = 11;

		const increase = new UndoOperation(
			() => (x -= 1),
			() => (x += 1)
		);
		const decrease = new UndoOperation(
			() => (x += 1),
			() => (x -= 1)
		);
		const multiplyBy3 = new UndoOperation(
			() => (x /= 3),
			() => (x *= 3)
		);

		const subject = new UndoBatchOperation([increase, increase, multiplyBy3, decrease]);
		subject.undo();
		expect(x).toBe(2);

		subject.redo();
		expect(x).toBe(11);

		subject.undo();
		expect(x).toBe(2);
	});
});
