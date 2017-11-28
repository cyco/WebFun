import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x0e,
	Arguments: [Type.TileID],
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => false
};
