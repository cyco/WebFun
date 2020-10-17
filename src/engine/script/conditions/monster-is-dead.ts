import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x0b,
	Arguments: [Type.MonsterId],
	Description: "True if monster `arg_0` is dead.",
	Implementation: async (args: int16[], zone: Zone, _: Engine): Promise<boolean> =>
		args[0] >= 0 && args[0] <= zone.monsters.length && zone.monsters[args[0]] && !zone.monsters[args[0]].alive
};
