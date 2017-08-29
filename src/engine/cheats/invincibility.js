import Cheat from "./cheat";

export default class InvincibilityCheat extends Cheat {
	execute(engine) {
		engine.hero.invincible = true;
	}

	get code() {
		return "goyoda";
	}

	get message() {
		return "Invincible!";
	}
}
