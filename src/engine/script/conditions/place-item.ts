import { Type, int16 } from "../types";

import Engine from "../../engine";
import EvaluationMode from "../evaluation-mode";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x03,
	Arguments: [Type.Number, Type.Number, Type.Number, Type.Number, Type.Number],
	Implementation: async (
		args: int16[],
		zone: Zone,
		engine: Engine,
		mode: EvaluationMode
	): Promise<boolean> => {
		if (mode !== EvaluationMode.PlaceItem) return false;

		let [x, y, z, target, item] = args;
		if (x < 0 || y < 0 || z < 0 || target < 0) {
			console.warn("Not implemented");
			return false;
		}

		if (item < 0) {
			const worldItem = engine.currentWorld.itemForZone(zone);
			item = worldItem.requiredItem.id;
		}

		return (
			engine.inputManager.placedTileLocation.x === x &&
			engine.inputManager.placedTileLocation.y === y &&
			engine.inputManager.placedTile.id === item &&
			zone.getTileID(x, y, z) === target
		);
	}
};
