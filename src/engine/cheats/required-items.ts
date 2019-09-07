import Cheat from "./cheat";
import Engine from "../engine";

class InvincibilityCheat extends Cheat {
	get code(): string {
		return "go3po";
	}

	get message(): string {
		return "It's Dangerous to Go Alone! Take This!";
	}

	public execute(engine: Engine): void {
		const quest = engine.currentWorld.findSectorContainingZone(engine.currentZone);
		if (!quest) return;

		const i1 = quest.requiredItem;
		if (i1) engine.inventory.addItem(i1);
		const i2 = quest.additionalRequiredItem;
		if (i2) engine.inventory.addItem(i2);
	}
}

export default InvincibilityCheat;
