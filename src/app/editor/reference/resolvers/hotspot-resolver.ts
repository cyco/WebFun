import DisableHotspot from "src/engine/script/instructions/disable-hotspot";
import EnableHotspot from "src/engine/script/instructions/enable-hotspot";
import { AssetManager } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";

class HotspotResolver implements ResolverInterface<Hotspot> {
	private _assets: AssetManager;

	constructor(assets: AssetManager) {
		this._assets = assets;
	}

	public resolve(needle: Hotspot, op = equal): ReferencesTo<Hotspot> {
		const result: ReferencesTo<Hotspot> = [];
		for (const zone of this._assets.getAll(Zone)) {
			if (!zone.hotspots.includes(needle)) continue;

			for (const hotspot of zone.hotspots) {
				if (op(hotspot.id, needle.id)) {
					result.push({ from: hotspot, to: hotspot, via: ["id"] });
					result.push({ from: zone, to: hotspot, via: [] });
				}
			}

			for (const action of zone.actions) {
				for (const instruction of action.instructions) {
					if (
						instruction.opcode === DisableHotspot.Opcode &&
						op(instruction.arguments[0], needle.id)
					) {
						result.push({ from: instruction, to: needle, via: [zone, action, 0] });
					}

					if (
						instruction.opcode === EnableHotspot.Opcode &&
						op(instruction.arguments[0], needle.id)
					) {
						result.push({ from: instruction, to: needle, via: [zone, action, 0] });
					}
				}
			}
		}

		return result;
	}
}

export default HotspotResolver;
