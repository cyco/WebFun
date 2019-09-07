import Engine from "../../engine";
import { Zone } from "src/engine/objects";
import { Type, int16 } from "../types";

export default {
	Opcode: 0x18,
	Arguments: [Type.ZoneX, Type.ZoneY],
	Description: "True if hero's x/y position is `args_0`x`args_1`.",
	Implementation: async (args: int16[], _: Zone, engine: Engine): Promise<boolean> =>
		engine.hero.location.x === args[0] && engine.hero.location.y === args[1]
};
