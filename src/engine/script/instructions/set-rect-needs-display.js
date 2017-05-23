import * as Result from "../result";

export const Opcode = 0x07;
export const Arguments = -1;
export default (instruction, engine, action) => Result.OK;
/*
	YodaView::RedrawRect(view, instruction->arg1, instruction->arg2, instruction->arg3, instruction->arg4);
	YodaDocument::RedrawCurrentZone(document);
*/