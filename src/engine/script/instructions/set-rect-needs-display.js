import * as Result from "../result";

export const Opcode = 0x07;
export const Arguments = -1;
export const Description = "Redraw the part of the current scene, specified by a rectangle positioned at `arg_0`x`arg_1` with width `arg_2` and height `arg_3`.";
export default (instruction, engine, action) => Result.OK;
/*
 YodaView::RedrawRect(view, instruction->arg1, instruction->arg2, instruction->arg3, instruction->arg4);
 YodaDocument::RedrawCurrentZone(document);
 */
