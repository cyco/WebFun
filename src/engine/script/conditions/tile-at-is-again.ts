import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x22,
	Arguments: [Type.TileID, Type.Number, Type.Number, Type.Number],
	Description: "Same as opcode 0x0a. Check if tile at `arg_0`x`arg_1`x`arg_2` is equal to `arg_3`",
	Implementation: async (args: int16[], _: Zone, engine: Engine): Promise<boolean> =>
		engine.currentZone.getTileID(args[1], args[2], args[3]) === args[0]
};
