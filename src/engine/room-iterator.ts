import { Zone, Hotspot } from "./objects";
import AssetManager from "./asset-manager";

function* iterate(zone: Zone, assets: AssetManager): Iterable<Zone> {
	yield zone;

	for (const { type, arg } of zone.hotspots) {
		if (type !== Hotspot.Type.DoorIn) continue;
		if (arg < 0) continue;
		for (const room of iterate(assets.get(Zone, arg), assets)) yield room;
	}
}

export default iterate;
