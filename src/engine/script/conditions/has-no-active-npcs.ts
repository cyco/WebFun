import Engine from "../../engine";
import { Zone } from "src/engine/objects";
import { int16 } from "../types";

// TODO: rename condition to something like 'all nps disabled'
export default {
	Opcode: 0x0c,
	Arguments: [],
	Implementation: async (_: int16[], zone: Zone, _engine: Engine): Promise<boolean> =>
		!zone.npcs.some(npc => npc.enabled)
};
