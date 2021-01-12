import Engine from "../../engine";
import { Zone } from "src/engine/objects";
import { int16 } from "../types";

export default {
	Opcode: 0x09,
	Arguments: [],
	Implementation: async (_: int16[], _zone: Zone, engine: Engine): Promise<boolean> =>
		engine.temporaryState.enteredByPlane
};
