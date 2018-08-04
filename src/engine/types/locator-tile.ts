import { HotspotType, Zone, ZoneType } from "src/engine/objects";
import Settings from "src/settings";

abstract class LocatorTile {
	abstract get here(): number;
	abstract get backgroundColor(): string;
	abstract forZone(
		zone: Zone,
		visited?: boolean,
		reveal?: boolean
	): number | [number] | [number, number];
}

export default LocatorTile;
