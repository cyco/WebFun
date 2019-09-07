import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x16,
	Arguments: [Type.Number],
	Description: "True the item provided by current zone is `arg_0`",
	Implementation: async (_: int16[], _zone: Zone, _engine: Engine): Promise<boolean> => false // TODO: fix implementation
};
