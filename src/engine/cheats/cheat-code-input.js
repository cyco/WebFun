export default class CheatCodeInput {
	constructor(cheats) {
		this._input = "";
		this._cheats = cheats;
	}

	addCharacter(c) {
		this._input += c;
	}

	reset() {
		this._input = "";
	}

	execute(engine) {
		const completedCheats = this._cheats.filter((c) => c.code === this._input);
		completedCheats.forEach((c) => c.execute(engine));
		return completedCheats.map((c) => c.message);
	}
}
