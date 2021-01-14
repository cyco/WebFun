import DisableHotspot from "src/engine/script/instructions/disable-hotspot";
import EnableHotspot from "src/engine/script/instructions/enable-hotspot";
import { GameData } from "src/engine";
import { Hotspot } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";

class HotspotResolver implements ResolverInterface<Hotspot> {
	private data: GameData;
	constructor(data: GameData) {
		this.data = data;
	}

	public resolve(needle: Hotspot, op = equal): ReferencesTo<Hotspot> {
		const result: ReferencesTo<Hotspot> = [];
		for (const zone of this.data.zones) {
			if (!zone.hotspots.includes(needle)) continue;

			for (const hotspot of zone.hotspots) {
				if (op(hotspot.id, needle.id)) {
					result.push({ from: hotspot, to: hotspot, via: ["id"] });
				}
			}

			for (const action of zone.actions) {
				for (const instruction of action.instructions) {
					if (
						instruction.opcode === DisableHotspot.Opcode &&
						op(instruction.arguments[0], needle.id)
					) {
						result.push({ from: instruction, to: needle, via: [zone, action] });
					}

					if (
						instruction.opcode === EnableHotspot.Opcode &&
						op(instruction.arguments[0], needle.id)
					) {
						result.push({ from: instruction, to: needle, via: [zone, action] });
					}
				}
			}

			result.push({ from: zone, to: needle, via: [] });
		}

		return result;
	}
}

export default HotspotResolver;
