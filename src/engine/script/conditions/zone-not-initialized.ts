import Engine from "../../engine";
import { Zone } from "src/engine/objects";
import { int16 } from "../types";

export default {
	Opcode: 0x00,
	Arguments: [],
	Description: "Evaluates to true exactly once (used for initialization)",
	Implementation: async (_: int16[], zone: Zone, _engine: Engine): Promise<boolean> =>
		!zone.actionsInitialized
};
