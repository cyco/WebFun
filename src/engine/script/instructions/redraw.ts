import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x09;
export const Arguments = -1;
export const Description = "Redraw the whole scene immediately";
export default (instruction: Instruction, engine: Engine, action: Action): Result => ResultFlags.DidRedraw;
/*
 YodaView::Draw_(view, context);
 result_1 |= 0x80u;
 */
