import { Type, int16 } from "../types";

import Condition from "src/engine/script/condition";
import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x05,
	Name: "counter-is",
	Description: "Current zone's `counter` value is equal to `arg_0`",
	Arguments: [Type.Number],
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> => zone.counter === args[0]
} as Condition;
