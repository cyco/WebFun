import Cheat from "./cheat";

export default class extends Cheat {
	execute(engine) {
		engine.hero.unlimitedAmmo = true;
	}

	get code() {
		return "gohan";
	}

	get message() {
		return "Super Smuggler!";
	}
}
