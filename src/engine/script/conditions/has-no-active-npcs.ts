import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../types";

export default {
	Opcode: 0x0c,
	Arguments: [],
	Implementation: async (_: int16[], zone: Zone, _engine: Engine): Promise<boolean> =>
		!zone.npcs.some(npc => npc.enabled)
};
