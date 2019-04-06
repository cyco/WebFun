import Cheat from "./cheat";
import Engine from "../engine";

class InvincibilityCheat extends Cheat {
	get code(): string {
		return "goyoda";
	}

	get message(): string {
		return "Invincible!";
	}

	public execute(engine: Engine): void {
		engine.hero.invincible = true;
	}
}

export default InvincibilityCheat;
