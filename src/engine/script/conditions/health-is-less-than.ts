import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x13,
	Arguments: [Type.Number],
	Description: "Hero's health is less than `arg_0`.",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> =>
		engine.hero.health < args[0]
};
