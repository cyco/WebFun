import { Type, int16 } from "../types";

import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x19,
	Arguments: [Type.Number],
	Description: "Current zone's `shared-counter` value is equal to `arg_0`",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> =>
		zone.sharedCounter === args[0]
};
