import { Direction, EventTarget, Point } from "src/util";
import { Char, Zone } from "./objects";
import { Renderer } from "./rendering";

export const MAX_HEALTH = 0x300;
export const Events = {
	HealthChanged: "HealthChanged",
	WeaponChanged: "WeaponChanged",
	AmmoChanged: "AmmoChanged"
};

class Hero extends EventTarget {
	static readonly MAX_HEALTH = MAX_HEALTH;
	public visible: boolean = false;
	public _location: Point = new Point(0, 0, 1); // TODO: make private again
	public invincible: boolean = false;
	public unlimitedAmmo: boolean = false;
	public _actionFrames: number = 0; // TODO: make private again
	public _direction: number = Direction.South; // TODO: make private again
	public _appearance: Char = null; // TODO: make private again
	private _health: number = MAX_HEALTH;
	private _walking: boolean = false;
	private _attacking: boolean = false;
	private _dragging: boolean = false;
	private _weapon: Char = null;
	private _ammo: number = -1;
	private _ammoByWeapon: WeakMap<Char, number> = new WeakMap();

	static get Event() {
		return Events;
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

	get appearance() {
		return this._appearance;
	}

	set appearance(a) {
		this._appearance = a;
	}

	get weapon() {
		return this._weapon;
	}

	set weapon(weapon) {
		if (this._weapon) {
			this._ammoByWeapon.set(this._weapon, this._ammo);
		}

		this._weapon = weapon;
		this.dispatchEvent(Events.WeaponChanged, { weapon });
		if (!this._weapon) this.ammo = -1;
	}

	get ammo() {
		return this._ammo;
	}

	set ammo(ammo) {
		if (this.unlimitedAmmo) return;

		this._ammo = ammo;
		if (this.weapon) {
			this._ammoByWeapon.set(this.weapon, this._ammo);
		}

		this.dispatchEvent(Events.AmmoChanged, { ammo });
	}

	public getAmmoForWeapon(weapon: Char) {
		return this._ammoByWeapon.has(weapon) ? this._ammoByWeapon.get(weapon) : 0;
	}

	update(ticks: number): void {
		if (this.isWalking || this.isAttacking) this._actionFrames += ticks;
		else this._actionFrames = 0;
	}

	face(direction: number): void {
		this._direction = direction;
	}

	move(relative: Point, zone: Zone): boolean {
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
		if (this._doMove(relative, zone, this._dragging)) return (this._walking = true);

		// try moving vertically only
		relative.y = y;
		relative.x = 0;
		if (this._doMove(relative, zone, this._dragging)) return (this._walking = true);

		// restore original motion
		relative.x = x;
		relative.y = y;

		// don't move diagonally if the hero tries to drag or push something
		if (this._dragging) return (this._walking = false);

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

	private _doMove(rel: Point, z: Zone, dragging: boolean) {
		if (rel.isZeroPoint()) return false;

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

	private _doDrag(src: Point, target: Point, z: Zone): boolean {
		let t = z.getTile(src);
		if (!t || !t.isDraggable()) return false;

		if (z.getTile(target.x, target.y, 1) !== null) return false;

		z.setTile(null, src);
		z.setTile(t, target);

		return true;
	}
}

export default Hero;
