import Cheat from '/engine/cheats/cheat';

export default class extends Cheat {
	get code() {
		return 'gohan';
	}
	get message() {
		return 'Super Smuggler!';
	}

	execute(engine) {
		engine.state.hero.unlimitedAmmo = true;
	}
}
