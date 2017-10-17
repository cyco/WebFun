import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export const Opcode = 0x16;
export const Arguments = 1;
export const Description = "Disable hotspot `arg_0`";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	const zone = engine.currentZone;
	const hotspot = zone.hotspots[instruction.arguments[0]];
	if (hotspot) {
		hotspot.enabled = false;
		return Result.UpdateHotspot;
	}

	return Result.OK;
};
