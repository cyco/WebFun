import { ConditionImplementation, Type } from "./types";

type Condition = {
	Opcode: number;
	Implementation: ConditionImplementation;
	Description?: string;
	Arguments?: Type[];
};
export default Condition;
