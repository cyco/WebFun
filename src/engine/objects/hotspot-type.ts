class HotspotType {
	public static readonly DropQuestItem = new HotspotType();
	public static readonly SpawnLocation = new HotspotType();
	public static readonly DropUniqueWeapon = new HotspotType();
	public static readonly VehicleTo = new HotspotType();
	public static readonly VehicleBack = new HotspotType();
	public static readonly DropMap = new HotspotType();
	public static readonly DropItem = new HotspotType();
	public static readonly NPC = new HotspotType();
	public static readonly DropWeapon = new HotspotType();
	public static readonly DoorIn = new HotspotType();
	public static readonly DoorOut = new HotspotType();
	public static readonly Unused = new HotspotType();
	public static readonly Lock = new HotspotType();
	public static readonly Teleporter = new HotspotType();
	public static readonly ShipToPlanet = new HotspotType();
	public static readonly ShipFromPlanet = new HotspotType();

	public static readonly knownTypes = [
		HotspotType.DropQuestItem,
		HotspotType.SpawnLocation,
		HotspotType.DropUniqueWeapon,
		HotspotType.VehicleTo,
		HotspotType.VehicleBack,
		HotspotType.DropMap,
		HotspotType.DropItem,
		HotspotType.NPC,
		HotspotType.DropWeapon,
		HotspotType.DoorIn,
		HotspotType.DoorOut,
		HotspotType.Unused,
		HotspotType.Lock,
		HotspotType.Teleporter,
		HotspotType.ShipToPlanet,
		HotspotType.ShipFromPlanet
	];

	get rawValue(): number {
		return HotspotType.knownTypes.indexOf(this);
	}

	get name(): string {
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
			case HotspotType.NPC:
				return "NPC";
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
			case HotspotType.ShipToPlanet:
				return "ShipToPlanet";
			case HotspotType.ShipFromPlanet:
				return "ShipFromPlanet";
			default:
				return "unknown";
		}
	}

	public static isHotspotType(number: number): boolean {
		return number >= 0 && number < HotspotType.knownTypes.length;
	}

	public static fromNumber(num: number): HotspotType {
		if (!HotspotType.isHotspotType(num)) {
			throw `Value ${num} does not specify a valid hotspot type!`;
		}

		return HotspotType.knownTypes[num];
	}

	public canHoldItem(): boolean {
		switch (this) {
			case HotspotType.DropItem:
			case HotspotType.NPC:
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
