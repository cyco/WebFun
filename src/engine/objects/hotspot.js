export const Type = {
	TriggerLocation: 0x00,
	SpawnLocation: 0x01,
	ForceLocation: 0x02,
	VehicleTo: 0x03,
	VehicleBack: 0x04,
	LocatorThingy: 0x05,
	CrateItem: 0x06,
	PuzzleNPC: 0x07,
	CrateWeapon: 0x08,
	DoorIn: 0x09,
	DoorOut: 0x0A,
	Unused: 0x0B,
	Lock: 0x0C,
	Teleporter: 0x0D,
	xWingFromD: 0x0E,
	xWingToD: 0x0F
};

export default class Hotspot {
	static get Type() {
		return Type;
	}

	constructor() {
		this._x = -1;
		this._y = -1;

		this.enabled = false;
		this.arg = -1;
		this.type = -1;

		Object.seal(this);
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}
}
