import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x15,
	Arguments: [Type.HotspotID],
	Description: "Enable hotspot `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const zone = engine.currentZone;
		const hotspot = zone.hotspots[instruction.arguments[0]];
		if (hotspot) hotspot.enabled = true;

		return Result.UpdateHotspot;
	}
};
