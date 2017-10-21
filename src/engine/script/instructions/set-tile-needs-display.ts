import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x06;
export const Arguments = -1;
export const Description = "Redraw tile at `arg_0`x`arg_1`";
export default (instruction: Instruction, engine: Engine, action: Action): Result => ResultFlags.OK;
/*
 YodaView::RedrawTile(view, instruction->arg1, instruction->arg2);
 YodaDocument::RedrawCurrentZone(document);
 */
