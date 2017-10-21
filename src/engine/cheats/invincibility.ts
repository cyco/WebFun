import Engine from "../engine";
import Cheat from "./cheat";

class InvincibilityCheat extends Cheat {
	get code(): string {
		return "goyoda";
	}

	get message(): string {
		return "Invincible!";
	}

	execute(engine: Engine): void {
		engine.hero.invincible = true;
	}
}

export default InvincibilityCheat;
