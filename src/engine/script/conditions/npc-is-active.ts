import { Type, int16 } from "../types";

import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x0b,
	Arguments: [Type.NPCID],
	Description: "True if npc `arg_0` is alive and well.",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> =>
		args[0] >= 0 && args[0] <= zone.npcs.length && zone.npcs[args[0]] && zone.npcs[args[0]].id !== -1 // TODO: might be npc.enabled
};
