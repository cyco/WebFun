import { Type, int16 } from "../types";

import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x07,
	Arguments: [Type.Number],
	Description: "Current zone's `random` value is greater than `arg_0`",
	Implementation: async (args: int16[], zone: Zone, _engine: Engine): Promise<boolean> =>
		zone.random > args[0]
};
