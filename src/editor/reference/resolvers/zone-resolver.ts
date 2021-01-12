import ChangeZone from "src/engine/script/instructions/change-zone";
import GameData from "src/engine/game-data";
import { Hotspot, Zone } from "src/engine/objects";
import { ReferencesTo } from "src/editor/reference";
import { equal } from "src/util/functional";

class ZoneResolver {
	private data: GameData;
	constructor(data: GameData) {
		this.data = data;
	}

	public resolve(needle: Zone, op = equal): ReferencesTo<Zone> {
		const result: ReferencesTo<Zone> = [];

		for (const zone of this.data.zones) {
			for (const hotspot of zone.hotspots) {
				if (hotspot.type === Hotspot.Type.DoorIn && op(hotspot.arg, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}

				if (hotspot.type === Hotspot.Type.DoorOut && op(hotspot.arg, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}
			}

			for (const action of zone.actions) {
				for (const instruction of action.instructions) {
					if (instruction.opcode === ChangeZone.Opcode && op(instruction.arguments[0], needle.id)) {
						result.push({ to: needle, from: instruction, via: [zone, action] });
					}
				}
			}
		}

		return result;
	}
}

export default ZoneResolver;
