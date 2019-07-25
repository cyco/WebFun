import CheatCodeInput from "src/engine/cheats/cheat-code-input";
import { Engine } from "src/engine";

describe("WebFun.Engine.Cheats.CheatCodeInput", () => {
	let cheatExecuted = false;
	const mockCheat = {
		code: "test",
		message: "test executed",
		execute() {
			cheatExecuted = true;
		}
	};
	const engine = ({} as any) as Engine;

	beforeEach(() => (cheatExecuted = false));

	it("takes pressed keys and executes matching cheats", () => {
		const subject = new CheatCodeInput([mockCheat]);

		subject.addCharacter("t");
		subject.addCharacter("e");
		subject.addCharacter("s");

		subject.execute(engine);
		expect(cheatExecuted).toBeFalse();

		subject.addCharacter("t");
		subject.execute(engine);

		expect(cheatExecuted).toBeTrue();
	});

	it("returns an array of messages to be shown for each executed cheat", () => {
		const subject = new CheatCodeInput([mockCheat]);

		subject.addCharacter("t");
		subject.addCharacter("e");
		subject.addCharacter("s");

		expect(subject.execute(engine)).toEqual([]);

		subject.addCharacter("t");

		expect(subject.execute(engine)).toEqual(["test executed"]);
	});

	it("can reset previously given iinput", () => {
		const subject = new CheatCodeInput([mockCheat]);

		subject.addCharacter("t");
		subject.addCharacter("e");
		subject.addCharacter("s");

		subject.reset();
		subject.addCharacter("t");

		subject.execute(engine);
		expect(cheatExecuted).toBeFalse();
	});
});
