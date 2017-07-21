import { EventTarget, Point, Direction } from "/util";

export const MAX_HEALTH = 0x300;
export const Events = {
	HealthChanged: "HealthChanged",
	WeaponChanged: "WeaponChanged",
	AmmoChanged: "AmmoChanged"
};

export default class Hero extends EventTarget {
	static get Event() {
		return Events;
	}

	constructor() {
		super();

		this._visible = false;

		this._location = new Point(0, 0, 1);
		this._health = MAX_HEALTH;
		this.invincible = false;
		this.unlimitedAmmo = false;

		this._actionFrames = 0;
		this._direction = Direction.South;
		this._walking = false;
		this._attacking = false;

		this._dragging = false;
		this._weapon = null;
	}

	update(ticks) {
		if (this.isWalking || this.isAttacking)
			this._actionFrames += ticks;
		else
			this._actionFrames = 0;
	}

	face(direction) {
		this._direction = direction;
	}

	move(relative, zone) {
		let targetPoint = Point.add(relative, this._location);

		// Look where we're going
		//    this.face(relative);

		// check if target is within the current zone
		const zoneSize = zone.size;
		if (!targetPoint.isInBounds(zoneSize)) {
			return (this._walking = false);
		}

		if (this._doMove(relative, zone, relative.isUnidirectional() && this._dragging))
			return (this._walking = true);

		let y = relative.y;
		let x = relative.x;

		// try moving horizontally only
		relative.y = 0;
		if (this._doMove(relative, zone, this._dragging))
			return (this._walking = true);

		// try moving vertically only
		relative.y = y;
		relative.x = 0;
		if (this._doMove(relative, zone, this._dragging))
			return (this._walking = true);

		// restore original motion
		relative.x = x;
		relative.y = y;

		// don't move diagonally if the hero tries to drag or push something
		if (this._dragging)
			return (this._walking = false);

		// try to avoid the object by moving diagonally
		if (y !== 0 && x === 0) {
			relative.x = x - 1.0;

			if (Point.add(targetPoint, relative).isInBounds(zoneSize) && this._doMove(relative, zone, false))
				return (this._walking = true);

			relative.x = x + 1.0;
			if (Point.add(targetPoint, relative).isInBounds(zoneSize) && this._doMove(relative, zone, false))
				return (this._walking = true);
		} else if (x !== 0 && y === 0) {
			relative.y = y + 1.0;
			if (Point.add(targetPoint, relative).isInBounds(zoneSize) && this._doMove(relative, zone, false))
				return (this._walking = true);

			relative.y = y - 1.0;
			if (Point.add(targetPoint, relative).isInBounds(zoneSize) && this._doMove(relative, zone, false))
				return (this._walking = true);
		}

		return (this._walking = false);
	}

	_doMove(rel, z, dragging) {
		if (rel.isZeroPoint())
			return false;

		let source = this._location;
		let target = Point.add(source, rel);
		target.z = 1;

		if (z.placeWalkable(target)) {
			if (dragging) this._doDrag(Point.subtract(source, rel), source, z);
			this._location = target;
			return true;
		} else if (dragging) {
			let dragTarget = Point.add(target, rel);
			dragTarget.z = 1;
			if (dragTarget.isInBounds(z.size) && this._doDrag(target, dragTarget, z)) {
				this._location = target;
				return true;
			}
		}

		return false;
	}

	_doDrag(src, target, z) {
		let t = z.getTile(src);
		if (!t || !t.isDraggable())
			return false;

		if (z.getTile(target.x, target.y, 1) !== null)
			return false;

		z.setTile(null, src);
		z.setTile(t, target);

		return true;
	}

	render(offset, renderer) {
		if (!this._visible) return;

		let appearance = this._appearance;

		// TODO: implement appearance
		if (!appearance) return;
		let frame = this._actionFrames;
		if (this._attacking) {
			appearance = this.weapon;
		}

		const tile = appearance.getFace(this._direction, frame);
		if (tile) renderer.renderTile(tile, offset.x + this._location.x, offset.y + this._location.y, 1);
	}

	get visible() {
		return this._visible;
	}

	set visible(v) {
		this._visible = v;
	}

	get isWalking() {
		return this._walking;
	}

	set isWalking(w) {
		this._walking = w;
	}

	get isAttacking() {
		return this._attacking;
	}

	set isAttacking(a) {
		this._attacking = a;
	}

	get isDragging() {
		return this._dragging;
	}

	set isDragging(d) {
		this._dragging = d;
	}

	get health() {
		return this._health;
	}

	set health(h) {
		if (this.invincible) return;

		this._health = h;
		this.dispatchEvent(Events.HealthChanged, {
			health: h
		});
	}

	get location() {
		return this._location;
	}

	set location(l) {
		this._location = l;
	}

	get direction() {
		switch (Direction.Confine(this._direction)) {
			case Direction.NorthEast:
			case Direction.NorthWest:
			case Direction.North:
				return Direction.North;
			case Direction.SouthEast:
			case Direction.SouthWest:
			case Direction.South:
				return Direction.South;
			case Direction.East:
				return Direction.East;
			case Direction.West:
				return Direction.West;
		}
	}

	set appearance(a) {
		this._appearance = a;
	}

	get appearance() {
		return this._appearance;
	}

	set weapon(w) {
		if (this.unlimitedAmmo) return;

		this._weapon = w;
		this.dispatchEvent(Events.WeaponChanged, {
			weapon: w
		});
	}

	get weapon() {
		return this._weapon;
	}

	set ammo(a) {
		this._ammo = a;
		this.dispatchEvent(Events.AmmoChanged, {
			ammo: a
		});
	}

	get ammo() {
		return this._ammo;
	}
}
