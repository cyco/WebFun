import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x04,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.TileID],
	Description: "Check if hero is at `arg_0`x`arg_1` and the floor tile is `arg_2`",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> =>
		engine.hero.location.x === args[0] &&
		engine.hero.location.y === args[1] &&
		zone.getTileID(args[0], args[1], 0) === args[2]
};
