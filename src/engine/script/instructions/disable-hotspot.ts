import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x16,
	Arguments: [Type.HotspotID],
	Description: "Disable hotspot `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		const zone = engine.currentZone;
		const hotspot = zone.hotspots[instruction.arguments[0]];
		if (hotspot) {
			hotspot.enabled = false;
			return ResultFlags.UpdateHotspot;
		}

		return ResultFlags.OK;
	}
};
