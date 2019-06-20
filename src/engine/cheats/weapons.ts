import Cheat from "./cheat";
import Engine from "../engine";
import Yoda from "src/engine/yoda";
import { Tile } from "src/engine/objects";

class WeaponsCheat extends Cheat {
	get code() {
		return "gojedi";
	}

	get message() {
		return "Super Jedi!";
	}

	public execute(engine: Engine): void {
		for (let i = 0; i < 5; i++) {
			this.addItem(engine, Yoda.ItemIDs.ThermalDetonator);
		}
		this.addItem(engine, Yoda.ItemIDs.BlasterRifle);
		this.addItem(engine, Yoda.ItemIDs.Blaster);
		this.addItem(engine, Yoda.ItemIDs.TheForce);
	}

	private addItem(engine: Engine, id: number): void {
		const tile = engine.assetManager.get(Tile, id);
		engine.inventory.addItem(tile);
	}
}

export default WeaponsCheat;
