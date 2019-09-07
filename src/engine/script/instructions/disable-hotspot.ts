import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x16,
	Arguments: [Type.HotspotID],
	Description: "Disable hotspot `arg_0`",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		const zone = action.zone;
		const hotspot = zone.hotspots[instruction.arguments[0]];
		if (hotspot) {
			hotspot.enabled = false;
			return Result.Void;
		}

		return Result.Void;
	}
};
