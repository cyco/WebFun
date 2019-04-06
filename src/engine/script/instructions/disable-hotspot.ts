import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";

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
} as InstructionType;
