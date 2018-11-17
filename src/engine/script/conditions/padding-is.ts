import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x19,
	Arguments: [Type.Number],
	Description: "Current zone's `padding` value is equal to `arg_0`",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> => zone.padding === args[0]
};
