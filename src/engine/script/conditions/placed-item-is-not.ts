import { Type, int16 } from "../types";

import Engine from "../../engine";
import EvaluationMode from "../evaluation-mode";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x17,
	Arguments: [Type.Number, Type.Number, Type.Number, Type.TileID, Type.TileID],
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
			const sector = engine.currentWorld.findSectorContainingZone(zone);
			item = sector.requiredItem.id;
		}

		return (
			engine.inputManager.placedTileLocation.x === x &&
			engine.inputManager.placedTileLocation.y === y &&
			zone.getTileID(x, y, z) === target &&
			engine.inputManager.placedTile.id !== item
		);
	}
};
