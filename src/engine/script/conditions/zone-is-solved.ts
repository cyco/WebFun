import Engine from "../../engine";
import { Zone } from "src/engine/objects";
import { int16 } from "../types";

export default {
	Opcode: 0x10,
	Arguments: [],
	Description: "True if the current zone is solved",
	Implementation: async (_: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const sector = engine.currentWorld.findSectorContainingZone(zone);
		return sector && sector.solved;
	}
};
