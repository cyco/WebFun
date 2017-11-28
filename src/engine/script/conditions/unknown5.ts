import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x1e,
	Arguments: [Type.Number, Type.Number, Type.Number, Type.Number, Type.Number],
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => false
};
