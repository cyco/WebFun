import { InstructionImplementation, Type } from "./types";

export type Instruction = {
	Opcode: number;
	Implementation: InstructionImplementation;
	Description?: string;
	Arguments?: Type[];
	UsesText?: boolean;
};
export default Instruction;
