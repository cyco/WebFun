import { ConditionImplementation, Type } from "./types";

interface Condition {
	Opcode: number;
	Implementation: ConditionImplementation;
	Description?: string;
	Arguments?: Type[];
}
export default Condition;
