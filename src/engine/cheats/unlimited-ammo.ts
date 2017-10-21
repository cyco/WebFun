import Engine from "../engine";
import Cheat from "./cheat";

class UnlimitedAmmoCheat extends Cheat {
	get code(): string {
		return "gohan";
	}

	get message(): string {
		return "Super Smuggler!";
	}

	execute(engine: Engine): void {
		engine.hero.unlimitedAmmo = true;
	}
}

export default UnlimitedAmmoCheat;
