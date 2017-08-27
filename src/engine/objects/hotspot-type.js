export default {
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
	xWingToD: 0x0F,

	FromNumber(num) {
		if (!Object.values(this).contains(num) || typeof num !== "number")
			throw new Error(`Invalid hotspot type@ ${num} specified`);

		return num;
	}
};
