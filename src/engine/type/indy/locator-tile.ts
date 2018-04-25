import { HotspotType, Zone, ZoneType } from "src/engine/objects";
import Settings from "src/settings";
import LocatorTile from "src/engine/types/locator-tile";

export default class extends LocatorTile {
	get here() {
		return 639;
	}

	forZone(zone: Zone, visited?: boolean): number | [number] | [number, number] {
		if (!zone) return 378;

		if (visited === false || (visited === undefined && !zone.visited && !Settings.revealWorld))
			return 378;

		switch (zone.type) {
			case ZoneType.Empty:
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
				throw new Error(`Invalid zone type ${zone.type} supplied`);
		}
	}

	_hasTeleporterHotspot(zone: Zone): boolean {
		return !!zone.hotspots.find(({ type }) => type === HotspotType.Teleporter);
	}
}
