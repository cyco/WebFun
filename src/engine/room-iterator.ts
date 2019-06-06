import { Zone, Hotspot } from "./objects";

function* iterate(zone: Zone, allZones: Zone[]): Iterable<Zone> {
	yield zone;

	for (const { type, arg } of zone.hotspots) {
		if (type !== Hotspot.Type.DoorIn) continue;
		if (arg < 0) continue;
		for (const room of iterate(allZones[arg], allZones)) yield room;
	}
}

export default iterate;
