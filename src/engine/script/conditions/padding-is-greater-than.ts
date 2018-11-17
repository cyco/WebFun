import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x1b,
	Arguments: [Type.Number],
	Description: "Current zone's `padding` value is greater than `arg_0`",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> => zone.padding > args[0]
};
