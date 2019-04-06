import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";

export default {
	Opcode: 0x06,
	Arguments: [Type.ZoneX, Type.ZoneY],
	Description: "Redraw tile at `arg_0`x`arg_1`",
	Implementation: async (_instruction: Instruction, _engine: Engine, _action: Action): Promise<Result> =>
		Result.Void
	/*
	 YodaView::RedrawTile(view, instruction->arg1, instruction->arg2);
	 YodaDocument::RedrawCurrentZone(document);
	 */
} as InstructionType;
