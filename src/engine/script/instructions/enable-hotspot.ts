import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x15,
	Arguments: [Type.HotspotID],
	Description: "Enable hotspot `arg_0`",
	Implementation: async (instruction: Instruction, _engine: Engine, action: Action): Promise<Result> => {
		const zone = action.zone;
		const hotspot = zone.hotspots[instruction.arguments[0]];
		if (hotspot) hotspot.enabled = true;

		return Result.Void;
	}
};
