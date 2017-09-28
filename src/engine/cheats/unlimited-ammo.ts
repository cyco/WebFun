import Cheat from "./cheat";
import Engine from "../engine";

class UnlimitedAmmoCheat extends Cheat {
	execute(engine: Engine): void {
		engine.hero.unlimitedAmmo = true;
	}

	get code(): string {
		return "gohan";
	}

	get message(): string {
		return "Super Smuggler!";
	}
}

export default UnlimitedAmmoCheat;
