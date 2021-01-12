import DisableHotspot from "src/engine/script/instructions/disable-hotspot";
import EnableHotspot from "src/engine/script/instructions/enable-hotspot";
import { GameData } from "src/engine";
import { Hotspot } from "src/engine/objects";
import { ReferencesTo } from "src/editor/reference";
import { equal } from "src/util/functional";

class HotspotResolver {
	private data: GameData;
	constructor(data: GameData) {
		this.data = data;
	}

	public resolve(hotspot: Hotspot, op = equal): ReferencesTo<Hotspot> {
		const result: ReferencesTo<Hotspot> = [];
		for (const zone of this.data.zones) {
			if (!zone.hotspots.includes(hotspot)) continue;

			for (const action of zone.actions) {
				for (const instruction of action.instructions) {
					if (
						instruction.opcode === DisableHotspot.Opcode &&
						op(instruction.arguments[0], hotspot.id)
					) {
						result.push({ from: instruction, to: hotspot, via: [zone, action] });
					}

					if (
						instruction.opcode === EnableHotspot.Opcode &&
						op(instruction.arguments[0], hotspot.id)
					) {
						result.push({ from: instruction, to: hotspot, via: [zone, action] });
					}
				}
			}
		}

		return result;
	}
}

export default HotspotResolver;
