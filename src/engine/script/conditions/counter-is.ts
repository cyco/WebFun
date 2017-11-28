import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x05,
	Name: "counter-is",
	Description: "Current zone's `counter` value is equal to `arg_0`",
	Arguments: [Type.Number],
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> =>
		zone.counter === args[0]
};
