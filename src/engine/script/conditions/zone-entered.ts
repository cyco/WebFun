import Engine from "../../engine";
import { Zone } from "src/engine/objects";
import { int16 } from "../types";

export default {
	Opcode: 0x01,
	Arguments: [],
	Description: "Evaluates to true if hero just entered the zone",
	Implementation: async (_args: int16[], _: Zone, engine: Engine): Promise<boolean> =>
		engine.temporaryState.justEntered
};
