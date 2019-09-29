class HotspotType {
	public static readonly DropQuestItem = new HotspotType();
	public static readonly SpawnLocation = new HotspotType();
	public static readonly DropUniqueWeapon = new HotspotType();
	public static readonly VehicleTo = new HotspotType();
	public static readonly VehicleBack = new HotspotType();
	public static readonly DropMap = new HotspotType();
	public static readonly DropItem = new HotspotType();
	public static readonly PuzzleNPC = new HotspotType();
	public static readonly DropWeapon = new HotspotType();
	public static readonly DoorIn = new HotspotType();
	public static readonly DoorOut = new HotspotType();
	public static readonly Unused = new HotspotType();
	public static readonly Lock = new HotspotType();
	public static readonly Teleporter = new HotspotType();
	public static readonly xWingFromDagobah = new HotspotType();
	public static readonly xWingToDagobah = new HotspotType();

	public static readonly knownTypes = [
		HotspotType.DropQuestItem,
		HotspotType.SpawnLocation,
		HotspotType.DropUniqueWeapon,
		HotspotType.VehicleTo,
		HotspotType.VehicleBack,
		HotspotType.DropMap,
		HotspotType.DropItem,
		HotspotType.PuzzleNPC,
		HotspotType.DropWeapon,
		HotspotType.DoorIn,
		HotspotType.DoorOut,
		HotspotType.Unused,
		HotspotType.Lock,
		HotspotType.Teleporter,
		HotspotType.xWingFromDagobah,
		HotspotType.xWingToDagobah
	];

	get rawValue(): number {
		return HotspotType.knownTypes.indexOf(this);
	}

	get name() {
		switch (this) {
			case HotspotType.DropQuestItem:
				return "DropQuestItem";
			case HotspotType.SpawnLocation:
				return "SpawnLocation";
			case HotspotType.DropUniqueWeapon:
				return "DropUniqueWeapon";
			case HotspotType.VehicleTo:
				return "VehicleTo";
			case HotspotType.VehicleBack:
				return "VehicleBack";
			case HotspotType.DropMap:
				return "DropMap";
			case HotspotType.DropItem:
				return "DropItem";
			case HotspotType.PuzzleNPC:
				return "PuzzleNPC";
			case HotspotType.DropWeapon:
				return "DropWeapon";
			case HotspotType.DoorIn:
				return "DoorIn";
			case HotspotType.DoorOut:
				return "DoorOut";
			case HotspotType.Unused:
				return "Unused";
			case HotspotType.Lock:
				return "Lock";
			case HotspotType.Teleporter:
				return "Teleporter";
			case HotspotType.xWingFromDagobah:
				return "xWingFromDagobah";
			case HotspotType.xWingToDagobah:
				return "xWingToDagobah";
			default:
				return "unknown";
		}
	}

	public static isHotspotType(number: number) {
		return number >= 0 && number < HotspotType.knownTypes.length;
	}

	public static fromNumber(num: number): HotspotType {
		if (!HotspotType.isHotspotType(num)) {
			throw `Value ${num} does not specify a valid hotspot type!`;
		}

		return HotspotType.knownTypes[num];
	}

	public canHoldItem() {
		switch (this) {
			case HotspotType.DropItem:
			case HotspotType.PuzzleNPC:
			case HotspotType.DropWeapon:
				return true;
			default:
				return false;
		}
	}

	public toString(): string {
		return `HotspotType{${this.name}}`;
	}
}

export default HotspotType;
