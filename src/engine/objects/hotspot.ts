import { Point } from "src/util";
import HotspotType from "./hotspot-type";
import { Hotspot as RawHotspot } from "src/engine/file-format/types";

class Hotspot {
	public static readonly Type = HotspotType;

	public id: number;
	public x: number;
	public y: number;

	public enabled: boolean;
	public argument: number;
	public type: HotspotType;

	public constructor(id: number, data: Hotspot | RawHotspot) {
		this.id = id;
		this.enabled = data.enabled;
		this.x = data.x;
		this.y = data.y;

		if (data instanceof Hotspot) {
			this.argument = data.argument;
			this.type = data.type;
		} else {
			this.argument = data.argument;
			this.type = Hotspot.Type.fromNumber(data.type);

			switch (this.type) {
				case Hotspot.Type.DropQuestItem:
				case Hotspot.Type.SpawnLocation:
				case Hotspot.Type.DropUniqueWeapon:
				case Hotspot.Type.DropMap:
					this.enabled = false;
					break;
				case Hotspot.Type.VehicleTo:
				case Hotspot.Type.VehicleBack:
				case Hotspot.Type.DoorIn:
				case Hotspot.Type.Lock:
				case Hotspot.Type.ShipToPlanet:
				case Hotspot.Type.ShipFromPlanet:
				case Hotspot.Type.DropItem:
				case Hotspot.Type.NPC:
				case Hotspot.Type.DropWeapon:
					this.enabled = true;
					break;
				default:
					this.argument = -1;
					this.enabled = true;
					break;
			}
		}
	}

	get location(): Point {
		return new Point(this.x, this.y);
	}

	public set location(l: Point) {
		this.x = l.x;
		this.y = l.y;
	}
}

declare namespace Hotspot {
	export type Type = HotspotType;
}

export default Hotspot;
