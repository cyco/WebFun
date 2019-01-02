import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x16,
	Arguments: [Type.HotspotID],
	Description: "Disable hotspot `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const zone = engine.currentZone;
		const hotspot = zone.hotspots[instruction.arguments[0]];
		if (hotspot) {
			hotspot.enabled = false;
			return Result.UpdateHotspot;
		}

		return Result.OK;
	}
};
