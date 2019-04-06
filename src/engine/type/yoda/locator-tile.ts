import { HotspotType, Zone, ZoneType } from "src/engine/objects";

import LocatorTile from "src/engine/types/locator-tile";
import { rgb } from "src/util";

export default class extends LocatorTile {
	get here() {
		return 0x345;
	}

	get backgroundColor() {
		return rgb(0, 0, 0);
	}

	forZone(zone: Zone, visited?: boolean, reveal: boolean = false): number | [number] | [number, number] {
		if (!zone) return 0x344;

		if (!reveal && (visited === false || (visited === undefined && !zone.visited))) return 0x343;

		switch (zone.type) {
			case ZoneType.Empty:
				if (this._hasTeleporterHotspot(zone)) {
					return [0x341, 0x342];
				}
				return 0x340;
			case ZoneType.Town:
				return [0x33d];
			case ZoneType.Goal:
				return [0x33f, 0x33e];
			case ZoneType.TravelStart:
				return [0x333, 0x334];
			case ZoneType.TravelEnd:
				return [0x333, 0x334];
			case ZoneType.BlockadeEast:
				return [0x337, 0x338];
			case ZoneType.BlockadeWest:
				return [0x33b, 0x33c];
			case ZoneType.BlockadeNorth:
				return [0x335, 0x336];
			case ZoneType.BlockadeSouth:
				return [0x339, 0x33a];
			case ZoneType.Use:
			case ZoneType.Trade:
			case ZoneType.Find:
			case ZoneType.FindTheForce:
				return [0x331, 0x332];
			default:
				return 0x340;
		}
	}

	private _hasTeleporterHotspot(zone: Zone): boolean {
		return !!zone.hotspots.find(({ type }) => type === HotspotType.Teleporter);
	}
}
