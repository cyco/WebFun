import Cheat from "/engine/cheats/cheat";

export default class InvincibilityCheat extends Cheat {
	get code() {
		return "goyoda";
	}
	get message() {
		return "Invincible!";
	}

	execute(engine) {
		engine.hero.invincible = true;
	}
}