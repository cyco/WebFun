import { srand } from "src/util";
import { Zone } from "src/engine/objects";

export default (zone: Zone, zones: Zone[]): Zone[] => {
	srand(zone.id);
	return zones
		.slice()
		.filter((z: Zone) => z !== zone && z.type === Zone.Type.Empty && z.planet === zone.planet)
		.shuffle();
};
