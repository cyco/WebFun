import Engine from "../../engine";
import { Zone } from "src/engine/objects";
import { Type, int16 } from "../types";

export default {
	Opcode: 0x1f,
	Arguments: [Type.Number],
	Description: "Current zone's `counter` value is not equal to `arg_0`",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> =>
		zone.counter !== args[0]
};
