import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Flags as Result, InstructionResult } from "../arguments";

export const Opcode = 0x06;
export const Arguments = -1;
export const Description = "Redraw tile at `arg_0`x`arg_1`";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => Result.OK;
/*
 YodaView::RedrawTile(view, instruction->arg1, instruction->arg2);
 YodaDocument::RedrawCurrentZone(document);
 */
