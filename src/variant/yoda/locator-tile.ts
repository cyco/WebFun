import Hotspot from "src/engine/objects/hotspot";
import Zone from "src/engine/objects/zone";

import LocatorTile from "src/engine/locator-tile";
import { rgb } from "src/util";

export default class extends LocatorTile {
	get here(): number {
		return 837;
	}

	get backgroundColor(): string {
		return rgb(0, 0, 0);
	}

	forZone(
		zone: Zone,
		visited?: boolean,
		reveal: boolean = false
	): number | [number] | [number, number] {
		if (!zone) return 836;

		if (!reveal && (visited === false || (visited === undefined && !zone.visited))) return 835;

		switch (zone.type) {
			case Zone.Type.Empty:
				if (this._hasTeleporterHotspot(zone)) {
					return [833, 834];
				}
				return 832;
			case Zone.Type.Town:
				return [829];
			case Zone.Type.Goal:
				return [831, 830];
			case Zone.Type.TravelStart:
				return [819, 820];
			case Zone.Type.TravelEnd:
				return [819, 820];
			case Zone.Type.BlockadeEast:
				return [823, 824];
			case Zone.Type.BlockadeWest:
				return [827, 828];
			case Zone.Type.BlockadeNorth:
				return [821, 822];
			case Zone.Type.BlockadeSouth:
				return [825, 826];
			case Zone.Type.Trade:
			case Zone.Type.Use:
			case Zone.Type.Find:
			case Zone.Type.FindUniqueWeapon:
				return [817, 818];
			default:
				return 832;
		}
	}

	private _hasTeleporterHotspot(zone: Zone): boolean {
		return !!zone.hotspots.find(({ type }) => type === Hotspot.Type.Teleporter);
	}
}
