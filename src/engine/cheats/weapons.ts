import Yoda from "src/engine/yoda";
import Engine from "../engine";
import Cheat from "./cheat";

class WeaponsCheat extends Cheat {
	get code() {
		return "gojedi";
	}

	get message() {
		return "Super Jedi!";
	}

	execute(engine: Engine): void {
		for (let i = 0; i < 5; i++) {
			this._addItem(engine, Yoda.ItemIDs.ThermalDetonator);
		}
		this._addItem(engine, Yoda.ItemIDs.BlasterRifle);
		this._addItem(engine, Yoda.ItemIDs.Blaster);
		this._addItem(engine, Yoda.ItemIDs.TheForce);
	}

	_addItem(engine: Engine, id: number): void {
		const tile = engine.data.tiles[id];
		engine.state.inventory.addItem(tile);
	}
}

export default WeaponsCheat;
