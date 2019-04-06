import { Type, int16 } from "../types";

import Condition from "src/engine/script/condition";
import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x14,
	Arguments: [Type.Number],
	Description: "Hero's health is greater than `arg_0`.",
	Implementation: async (args: int16[], _zone: Zone, engine: Engine): Promise<boolean> =>
		engine.hero.health > args[0]
} as Condition;
