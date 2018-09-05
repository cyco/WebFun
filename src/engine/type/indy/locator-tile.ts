import { HotspotType, Zone, ZoneType } from "src/engine/objects";
import LocatorTile from "src/engine/types/locator-tile";
import { rgb } from "src/util";

export default class extends LocatorTile {
	get here() {
		return 639;
	}

	get backgroundColor() {
		return rgb(79, 79, 15);
	}

	forZone(zone: Zone, visited?: boolean, reveal: boolean = false): number | [number] | [number, number] {
		if (!zone) return -1;

		if (!reveal && (visited === false || (visited === undefined && !zone.visited))) return 1138;

		switch (zone.type) {
			case ZoneType.Empty:
				if (this._hasTeleporterHotspot(zone)) {
					return [1139, 1131];
				}
				return 377;
			case ZoneType.Town:
				return [375];
			case ZoneType.Goal:
				return [408, 376];
			case ZoneType.TravelStart:
				return [365, 366];
			case ZoneType.TravelEnd:
				return [365, 366];
			case ZoneType.BlockadeEast:
				return [369, 370];
			case ZoneType.BlockadeWest:
				return [373, 374];
			case ZoneType.BlockadeNorth:
				return [367, 368];
			case ZoneType.BlockadeSouth:
				return [371, 372];
			case ZoneType.Use:
			case ZoneType.Trade:
			case ZoneType.Find:
			case ZoneType.FindTheForce:
				return [363, 364];
			default:
				return 377;
		}
	}

	private _hasTeleporterHotspot(zone: Zone): boolean {
		return !!zone.hotspots.find(({ type }) => type === HotspotType.Teleporter);
	}
}
