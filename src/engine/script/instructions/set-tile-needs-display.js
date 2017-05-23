import * as Result from "../result";

export const Opcode = 0x06;
export const Arguments = -1;
export default (instruction, engine, action) => Result.OK;
/*
	YodaView::RedrawTile(view, instruction->arg1, instruction->arg2);
    YodaDocument::RedrawCurrentZone(document);
*/