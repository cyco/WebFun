import { Hotspot, Zone } from "src/engine/objects";

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
			case Zone.Type.Empty:
				if (this._hasTeleporterHotspot(zone)) {
					return [1139, 1131];
				}
				return 377;
			case Zone.Type.Town:
				return [375];
			case Zone.Type.Goal:
				return [408, 376];
			case Zone.Type.TravelStart:
				return [365, 366];
			case Zone.Type.TravelEnd:
				return [365, 366];
			case Zone.Type.BlockadeEast:
				return [369, 370];
			case Zone.Type.BlockadeWest:
				return [373, 374];
			case Zone.Type.BlockadeNorth:
				return [367, 368];
			case Zone.Type.BlockadeSouth:
				return [371, 372];
			case Zone.Type.Use:
			case Zone.Type.Trade:
			case Zone.Type.Find:
			case Zone.Type.FindUniqueWeapon:
				return [363, 364];
			default:
				return 377;
		}
	}

	private _hasTeleporterHotspot(zone: Zone): boolean {
		return !!zone.hotspots.find(({ type }) => type === Hotspot.Type.Teleporter);
	}
}
