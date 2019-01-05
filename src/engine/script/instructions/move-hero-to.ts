import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x12,
	Arguments: [Type.ZoneX, Type.ZoneY],
	Description:
		"Set hero's position to `arg_0`x`arg_1` ignoring impassable tiles. Execute hotspot actions, redraw the current scene and move camera if the hero is not hidden.",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.hero.location.x = instruction.arguments[0];
		engine.hero.location.y = instruction.arguments[1];

		// original implementation actually has a hard break here
		return Result.Void;
	}
};
