import * as Result from "../result";

export const Opcode = 0x09;
export const Arguments = -1;
export default (instruction, engine, action) => Result.DidRedraw;
/*
 YodaView::Draw_(view, context);
 result_1 |= 0x80u;
*/