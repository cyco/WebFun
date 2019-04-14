import { Type, int16 } from "../types";

import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x1b,
	Arguments: [Type.Number],
	Description: "Current zone's `shared-counter` value is greater than `arg_0`",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> =>
		zone.sharedCounter > args[0]
};
