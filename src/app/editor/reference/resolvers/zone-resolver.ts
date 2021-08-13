import ChangeZone from "src/engine/script/instructions/change-zone";
import { Hotspot, Zone } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";
import { AssetManager } from "src/engine";

class ZoneResolver implements ResolverInterface<Zone> {
	private _assets: AssetManager;

	constructor(assets: AssetManager) {
		this._assets = assets;
	}

	public resolve(needle: Zone, op = equal): ReferencesTo<Zone> {
		const result: ReferencesTo<Zone> = [];

		for (const zone of this._assets.getAll(Zone)) {
			if (op(zone.id, needle.id)) {
				result.push({ from: zone, to: zone, via: ["id"] });
			}

			for (const hotspot of zone.hotspots) {
				if (hotspot.type === Hotspot.Type.DoorIn && op(hotspot.argument, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.DoorOut && op(hotspot.argument, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.ShipFromPlanet && op(hotspot.argument, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.ShipToPlanet && op(hotspot.argument, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.VehicleTo && op(hotspot.argument, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.VehicleBack && op(hotspot.argument, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}
			}

			for (const action of zone.actions) {
				for (const instruction of action.instructions) {
					if (instruction.opcode === ChangeZone.Opcode && op(instruction.arguments[0], needle.id)) {
						result.push({ to: needle, from: instruction, via: [zone, action, 0] });
					}
				}
			}
		}

		return result;
	}
}

export default ZoneResolver;
