import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";
import { Result } from "../types";

export default {
	Opcode: 0x09,
	Arguments: [],
	Description: "Redraw the whole scene immediately",
	Implementation: async (_: Instruction, _engine: Engine, _action: Action): Promise<Result> => Result.Void
	/*
	 YodaView::Draw_(view, context);
	 result_1 |= 0x80u;
	 */
} as InstructionType;
