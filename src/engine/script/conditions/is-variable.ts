import { Type, int16 } from "../types";

import Condition from "src/engine/script/condition";
import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x22,
	Arguments: [Type.TileID, Type.Number, Type.Number, Type.Number],
	Description:
		"Check if variable identified by `arg_0`⊕`arg_1`⊕`arg_2` is set to `arg_3`. Internally this is implemented as opcode 0x0a, check if tile at `arg_0`x`arg_1`x`arg_2` is equal to `arg_3`",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> =>
		zone.getTileID(args[1], args[2], args[3]) === args[0]
} as Condition;
