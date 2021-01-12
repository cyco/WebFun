import Zone from "src/engine/objects/zone";

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
