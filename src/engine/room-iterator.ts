import { Zone, Hotspot } from "./objects";
import AssetManager from "./asset-manager";

function* iterate(zone: Zone, assets: AssetManager): Iterable<Zone> {
	if (!zone) return;

	yield zone;

	for (const { type, argument } of zone.hotspots) {
		if (type !== Hotspot.Type.DoorIn) continue;
		if (argument < 0) continue;
		for (const room of iterate(assets.get(Zone, argument), assets)) yield room;
	}
}

export default iterate;
