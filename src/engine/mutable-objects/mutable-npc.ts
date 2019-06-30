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
		this.facingDirection = npc.facingDirection;
		this.lastDirectionChoice = npc.lastDirectionChoice;

		this.bulletPosition = npc.bulletPosition;
		this.direction = npc.direction;
		this.field10 = npc.field10;
		this.bulletX = npc.bulletX;
		this.bulletY = npc.bulletY;
		this.currentFrame = npc.currentFrame;
		this.flag18 = npc.flag18;
		this.flag1c = npc.flag1c;
		this.flag20 = npc.flag20;
		this.lastDirectionChoice = npc.lastDirectionChoice;
		this.hasItem = npc.hasItem;
		this.flag2c = npc.flag2c;
		this.field30 = npc.field30;
		this.field32 = npc.field32;
		this.flag34 = npc.flag34;
		this.directionX = npc.directionX;
		this.directionY = npc.directionY;
		this.field3c = npc.field3c;
		this.facingDirection = npc.facingDirection;
		this.field60 = npc.field60;
		this.field62 = npc.field62;
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
