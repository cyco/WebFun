import { Zone, Hotspot } from "./objects";
import AssetManager from "./asset-manager";

function* iterate(zone: Zone, assets: AssetManager): Iterable<Zone> {
	if (!zone) return;

	const visited = new Set();
	visited.add(zone);

	yield zone;

	for (const { type, argument } of zone.hotspots) {
		if (type !== Hotspot.Type.DoorIn) continue;
		if (argument < 0) continue;
		for (const room of iterate(assets.get(Zone, argument), assets)) {
			if (visited.has(room)) continue;

			visited.add(room);
			yield room;
		}
	}
}

export default iterate;
