import { NPC } from "src/engine/objects";

class MutableNPC extends NPC {
	constructor(npc?: NPC) {
		super();

		if (!npc) return;

		this._id = npc.id;
		this._enabled = npc.enabled;
		this._character = npc.face;
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

	get enabled() {
		return this._enabled;
	}

	set enabled(enabled) {
		this._enabled = enabled;
	}

	get character() {
		return this._character;
	}

	set character(character) {
		this._character = character;
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
