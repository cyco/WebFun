import Hotspot from "src/engine/objects/hotspot";
import Zone from "src/engine/objects/zone";

import LocatorTile from "../locator-tile";
import { rgb } from "src/util";

export default class extends LocatorTile {
	get here(): number {
		return 0x345;
	}

	get backgroundColor(): string {
		return rgb(0, 0, 0);
	}

	forZone(
		zone: Zone,
		visited?: boolean,
		reveal: boolean = false
	): number | [number] | [number, number] {
		if (!zone) return 0x344;

		if (!reveal && (visited === false || (visited === undefined && !zone.visited))) return 0x343;

		switch (zone.type) {
			case Zone.Type.Empty:
				if (this._hasTeleporterHotspot(zone)) {
					return [0x341, 0x342];
				}
				return 0x340;
			case Zone.Type.Town:
				return [0x33d];
			case Zone.Type.Goal:
				return [0x33f, 0x33e];
			case Zone.Type.TravelStart:
				return [0x333, 0x334];
			case Zone.Type.TravelEnd:
				return [0x333, 0x334];
			case Zone.Type.BlockadeEast:
				return [0x337, 0x338];
			case Zone.Type.BlockadeWest:
				return [0x33b, 0x33c];
			case Zone.Type.BlockadeNorth:
				return [0x335, 0x336];
			case Zone.Type.BlockadeSouth:
				return [0x339, 0x33a];
			case Zone.Type.Use:
			case Zone.Type.Trade:
			case Zone.Type.Find:
			case Zone.Type.FindUniqueWeapon:
				return [0x331, 0x332];
			default:
				return 0x340;
		}
	}

	private _hasTeleporterHotspot(zone: Zone): boolean {
		return !!zone.hotspots.find(({ type }) => type === Hotspot.Type.Teleporter);
	}
}
