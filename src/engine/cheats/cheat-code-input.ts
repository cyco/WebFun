import Cheat from "./cheat";
import Engine from "../engine";

class CheatCodeInput {
	private _input: string;
	private _cheats: Cheat[];

	constructor(cheats: Cheat[]) {
		this._input = "";
		this._cheats = cheats;
	}

	addCharacter(c: string): void {
		this._input += c;
	}

	reset(): void {
		this._input = "";
	}

	execute(engine: Engine): string[] {
		const completedCheats = this._cheats.filter((c) => c.code === this._input);
		completedCheats.forEach((c) => c.execute(engine));
		return completedCheats.map((c) => c.message);
	}
}

export default CheatCodeInput;
