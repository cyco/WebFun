import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x21,
	Arguments: [Type.Number],
	Description: "Current zone's `shared-counter` value is not equal to `arg_0`",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> => zone.sharedCounter !== args[0]
};
