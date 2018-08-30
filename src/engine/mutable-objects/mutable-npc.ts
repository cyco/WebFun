import { NPC } from "src/engine/objects";

class MutableNPC extends NPC {
	constructor(npc?: NPC) {
		super();

		if (!npc) return;

		this._id = npc.id;
		this._enabled = npc.enabled;
		this._character = npc.face;
		this._position = npc.position;
		this._unknown1 = npc.unknown1;
		this._unknown2 = npc.unknown2;
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

	get unknown1() {
		return this._unknown1;
	}

	set unknown1(unknown1) {
		this._unknown1 = unknown1;
	}

	set unknown2(unknown2) {
		this._unknown2 = unknown2;
	}

	get unknown2() {
		return this._unknown2;
	}

	get data() {
		return this._data;
	}

	set data(data) {
		this._data = data;
	}
}

export default MutableNPC;
