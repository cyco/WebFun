import Cheat from "./cheat";
import Engine from "../engine";

class InvincibilityCheat extends Cheat {
	execute(engine: Engine): void {
		engine.hero.invincible = true;
	}

	get code(): string {
		return "goyoda";
	}

	get message(): string {
		return "Invincible!";
	}
}

export default InvincibilityCheat;
