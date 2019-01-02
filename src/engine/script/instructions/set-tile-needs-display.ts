import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x06,
	Arguments: [Type.ZoneX, Type.ZoneY],
	Description: "Redraw tile at `arg_0`x`arg_1`",
	Implementation: async (_instruction: Instruction, _engine: Engine, _action: Action): Promise<Result> =>
		Result.OK
	/*
	 YodaView::RedrawTile(view, instruction->arg1, instruction->arg2);
	 YodaDocument::RedrawCurrentZone(document);
	 */
};
