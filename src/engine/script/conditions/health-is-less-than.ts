import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x13,
	Arguments: [Type.Number],
	Description: "Hero's health is less than `arg_0`.",
	Implementation: async (args: int16[], _: Zone, engine: Engine): Promise<boolean> =>
		engine.hero.health < args[0]
};
