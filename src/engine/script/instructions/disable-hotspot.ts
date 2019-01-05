import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
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
