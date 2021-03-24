import UndoManager from "src/ux/undo-manager";
import { UndoOperation } from "src/ux";

describe("WebFun.UX.UndoManager", () => {
	let subject: UndoManager;
	let state: number;

	beforeEach(() => {
		state = 0;
		subject = new UndoManager();
	});

	it("keeps a stack of `UndoOperation`s to revert user actions", () => {
		expect(UndoManager).toBeAClass();
	});

	describe("when some operations are added", () => {
		beforeEach(() => {
			state += 1;
			subject.note(
				new UndoOperation(
					() => (state -= 1),
					() => (state += 1)
				)
			);
			state *= 2;
			subject.note(
				() => (state /= 2),
				() => (state *= 2)
			);
			state -= 5;
			subject.note(
				() => (state += 5),
				() => (state -= 5)
			);
			state /= 3;
			subject.note(
				() => (state *= 3),
				() => (state /= 3)
			);
		});

		describe("and some are undone", () => {
			beforeEach(() => {
				subject.undo();
				subject.undo();
				subject.undo();
			});

			it("restores the correct state", () => {
				expect(state).toBe(1);
				subject.undo();
				expect(state).toBe(0);
				subject.undo();
				expect(state).toBe(0);
			});

			describe("and some more operations are added", () => {
				beforeEach(() => {
					state += 4;
					subject.note(
						() => (state -= 4),
						() => (state += 4)
					);
					state += 4;
					subject.note(
						() => (state -= 4),
						() => (state += 4)
					);
				});

				it("sets the proper state", () => {
					expect(state).toBe(9);
				});

				describe("and the operations are undone", () => {
					beforeEach(() => {
						subject.undo();
						subject.undo();
					});

					it("restores the proper value", () => {
						expect(state).toBe(1);
					});

					describe("and the changes are replayed again", () => {
						beforeEach(() => {
							subject.redo();
							subject.redo();
							subject.redo();
							subject.redo();
						});

						it("applies the changes from the last branch", () => {
							expect(state).toBe(9);
						});
					});
				});
			});

			describe("and there are no more operations to undo", () => {
				beforeEach(() => {
					subject.undo();
					subject.undo();
					subject.undo();
					subject.undo();
					subject.undo();
				});

				it("does not change the state anymore", () => {
					expect(state).toBe(0);
					subject.undo();
					expect(state).toBe(0);
				});
			});
		});
	});

	describe("batch operations", () => {
		beforeEach(() => {
			state = 0;
			subject.note(() => (state = 5));
		});
		describe("when a batch operation is started", () => {
			beforeEach(() => {
				subject.beginBatch();
			});

			describe("and some tasks are added", () => {
				beforeEach(() => {
					subject.note(
						() => (state -= 1),
						() => (state += 1)
					);
					subject.note(
						() => (state -= 1),
						() => (state += 1)
					);
					subject.note(
						() => (state -= 1),
						() => (state += 1)
					);
				});

				describe("and the batch is ended", () => {
					beforeEach(() => {
						subject.endBatch();
					});

					it("reverts all operations in one call", () => {
						subject.undo();
						expect(state).toBe(-3);
					});
				});

				describe("and the batch is cancelled", () => {
					beforeEach(() => {
						subject.cancelBatch();
					});

					it("reverts the initial operation instead", () => {
						subject.undo();
						expect(state).toBe(5);
					});
				});
			});
		});
	});
});
