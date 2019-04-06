import Cheat from "./cheat";
import Engine from "../engine";

class UnlimitedAmmoCheat extends Cheat {
	get code(): string {
		return "gohan";
	}

	get message(): string {
		return "Super Smuggler!";
	}

	public execute(engine: Engine): void {
		engine.hero.unlimitedAmmo = true;
	}
}

export default UnlimitedAmmoCheat;
