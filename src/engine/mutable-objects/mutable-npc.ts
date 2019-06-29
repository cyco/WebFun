import { NPC } from "src/engine/objects";

class MutableNPC extends NPC {
	constructor(npc?: NPC) {
		super();

		if (!npc) return;

		this._id = npc.id;
		this.enabled = npc.enabled;
		this.face = npc.face;
		this._position = npc.position;
		this._loot = npc.loot;
		this._dropsLoot = npc.dropsLoot;
		this._data = npc.unknown3;
	}

	get id() {
		return this._id;
	}

	set id(id) {
		this._id = id;
	}

	get position() {
		return this._position;
	}

	set position(position) {
		this._position = position;
	}

	get loot() {
		return this._loot;
	}

	set loot(loot) {
		this._loot = loot;
	}

	set dropsLoot(dropsLoot) {
		this._dropsLoot = dropsLoot;
	}

	get dropsLoot() {
		return this._dropsLoot;
	}

	get data() {
		return this._data;
	}

	set data(data) {
		this._data = data;
	}
}

export default MutableNPC;
