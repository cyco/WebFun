import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x09,
	Arguments: [],
	Implementation: async (_: int16[], _zone: Zone, engine: Engine): Promise<boolean> =>
		engine.temporaryState.enteredByPlane
};
