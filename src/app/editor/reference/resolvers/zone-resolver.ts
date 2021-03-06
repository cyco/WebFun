import ChangeZone from "src/engine/script/instructions/change-zone";
import GameData from "src/engine/game-data";
import { Hotspot, Zone } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";

class ZoneResolver implements ResolverInterface<Zone> {
	private data: GameData;

	constructor(data: GameData) {
		this.data = data;
	}

	public resolve(needle: Zone, op = equal): ReferencesTo<Zone> {
		const result: ReferencesTo<Zone> = [];

		for (const zone of this.data.zones) {
			if (op(zone.id, needle.id)) {
				result.push({ from: zone, to: zone, via: ["id"] });
			}

			for (const hotspot of zone.hotspots) {
				if (hotspot.type === Hotspot.Type.DoorIn && op(hotspot.arg, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.DoorOut && op(hotspot.arg, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.ShipFromPlanet && op(hotspot.arg, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.ShipToPlanet && op(hotspot.arg, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.VehicleTo && op(hotspot.arg, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.VehicleBack && op(hotspot.arg, needle.id)) {
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
