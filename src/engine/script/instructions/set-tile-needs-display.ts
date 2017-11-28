import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x06,
	Arguments: [Type.ZoneX, Type.ZoneY],
	Description: "Redraw tile at `arg_0`x`arg_1`",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => ResultFlags.OK
	/*
	 YodaView::RedrawTile(view, instruction->arg1, instruction->arg2);
	 YodaDocument::RedrawCurrentZone(document);
	 */
};
