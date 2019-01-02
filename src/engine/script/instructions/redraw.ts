import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x09,
	Arguments: [],
	Description: "Redraw the whole scene immediately",
	Implementation: async (_: Instruction, _engine: Engine, _action: Action): Promise<Result> =>
		Result.DidRedraw
	/*
	 YodaView::Draw_(view, context);
	 result_1 |= 0x80u;
	 */
};
