import CheatCodeInput from "src/engine/cheats/cheat-code-input";

describe("CheatCodeInput", () => {
	let subject;

	let cheatExecuted = false;
	const mockCheat = {
		code: "test",
		message: "test executed",
		execute() {
			cheatExecuted = true;
		}
	};

	beforeEach(() => cheatExecuted = false);

	it("takes pressed keys and executes matching cheats", () => {
		const subject = new CheatCodeInput([ mockCheat ]);

		subject.addCharacter("t");
		subject.addCharacter("e");
		subject.addCharacter("s");

		subject.execute();
		expect(cheatExecuted).toBeFalse();

		subject.addCharacter("t");
		subject.execute();

		expect(cheatExecuted).toBeTrue();
	});

	it("returns an array of messages to be shown for each executed cheat", () => {
		const subject = new CheatCodeInput([ mockCheat ]);

		subject.addCharacter("t");
		subject.addCharacter("e");
		subject.addCharacter("s");

		expect(subject.execute()).toEqual([]);

		subject.addCharacter("t");

		expect(subject.execute()).toEqual([ "test executed" ]);
	});

	it("can reset previously given iinput", () => {
		const subject = new CheatCodeInput([ mockCheat ]);

		subject.addCharacter("t");
		subject.addCharacter("e");
		subject.addCharacter("s");

		subject.reset();
		subject.addCharacter("t");

		subject.execute();
		expect(cheatExecuted).toBeFalse();
	});
});
