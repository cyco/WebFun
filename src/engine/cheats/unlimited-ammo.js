import Cheat from "./cheat";

export default class extends Cheat {
	get code() {
		return "gohan";
	}
	get message() {
		return "Super Smuggler!";
	}

	execute(engine) {
		engine.hero.unlimitedAmmo = true;
	}
}
