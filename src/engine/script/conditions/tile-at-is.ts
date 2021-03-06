import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x0a,
	Arguments: [Type.TileID, Type.Number, Type.Number, Type.Number],
	Description: "Check if tile at `arg_0`x`arg_1`x`arg_2` is equal to `arg_3`",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> =>
		zone.getTileID(args[1], args[2], args[3]) === args[0]
};
