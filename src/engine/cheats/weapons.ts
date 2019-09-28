import Cheat from "./cheat";
import Engine from "../engine";
import { Yoda } from "src/engine/type";
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
			this.addItem(engine, Yoda.tileIDs.ThermalDetonator);
		}
		this.addItem(engine, Yoda.tileIDs.BlasterRifle);
		this.addItem(engine, Yoda.tileIDs.Blaster);
		this.addItem(engine, Yoda.tileIDs.TheForce);
	}

	private addItem(engine: Engine, id: number): void {
		const tile = engine.assets.get(Tile, id);
		engine.inventory.addItem(tile);
	}
}

export default WeaponsCheat;
