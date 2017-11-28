import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x08,
	Arguments: [Type.Number],
	Description: "Current zone's `random` value is less than `arg_0`",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => zone.random < args[0]
};
