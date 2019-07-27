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
		this._waypoints = npc.waypoints;
		this.facingDirection = npc.facingDirection;
		this.cooldown = npc.cooldown;

		this.bullet = npc.bullet;
		this.direction = npc.direction;
		this.field10 = npc.field10;
		this.currentFrame = npc.currentFrame;
		this.flag18 = npc.flag18;
		this.flag1c = npc.flag1c;
		this.flag20 = npc.flag20;
		this.cooldown = npc.cooldown;
		this.hasItem = npc.hasItem;
		this.flag2c = npc.flag2c;
		this.preferredDirection = npc.preferredDirection;
		this.field32 = npc.field32;
		this.flag34 = npc.flag34;
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

	get waypoints() {
		return this._waypoints;
	}

	set waypoints(waypoints) {
		this._waypoints = waypoints;
	}
}

export default MutableNPC;
