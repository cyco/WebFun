import Cheat from "./cheat";
import Yoda from "/engine/yoda";

export default class WeaponsCheat extends Cheat {
	execute(engine) {
		5..times(() => this._addItem(engine, Yoda.ItemIDs.ThermalDetonator));
		this._addItem(engine, Yoda.ItemIDs.BlasterRifle);
		this._addItem(engine, Yoda.ItemIDs.Blaster);
		this._addItem(engine, Yoda.ItemIDs.TheForce);
	}

	_addItem(engine, id) {
		const tile = engine.data.tiles[id];
		engine.state.inventory.addItem(tile);
	}

	get code() {
		return "gojedi";
	}

	get message() {
		return "Super Jedi!";
	}
}
