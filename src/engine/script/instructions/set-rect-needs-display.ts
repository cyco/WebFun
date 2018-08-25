import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x07,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.Number, Type.Number],
	Description:
		"Redraw the part of the current scene, specified by a rectangle positioned at `arg_0`x`arg_1` with width `arg_2` and height `arg_3`.",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> =>
		ResultFlags.OK
	/*
	 YodaView::RedrawRect(view, instruction->arg1, instruction->arg2, instruction->arg3, instruction->arg4);
	 YodaDocument::RedrawCurrentZone(document);
	 */
};
