import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x0f,
	Arguments: [Type.TileID],
	Description: "True if `arg_0` is equal to current goal item id",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => engine.story.goal.item1.id === args[0]
};
