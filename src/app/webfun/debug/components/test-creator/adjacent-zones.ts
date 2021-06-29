import { srand } from "src/util";
import { Zone, Hotspot } from "src/engine/objects";

export default (zone: Zone, zones: Zone[]): Zone[] => {
	srand(zone.id);
	const adjacentZones = zones
		.slice()
		.filter((z: Zone) => z !== zone && z.type === Zone.Type.Empty && z.planet === zone.planet)
		.shuffle();

	if (zone.type === Zone.Type.TravelStart) {
		zone.hotspots
			.filter(htsp => htsp.type === Hotspot.Type.VehicleTo && htsp.arg !== -1)
			.map(htsp => htsp.arg)
			.forEach((id, idx) => (adjacentZones[idx] = zones[id]));
	}

	return adjacentZones;
};
