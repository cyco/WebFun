import { Type, int16 } from "../types";

import Condition from "src/engine/script/condition";
import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x16,
	Arguments: [Type.Number],
	Description: "True the item provided by current zone is `arg_0`",
	Implementation: async (_: int16[], _zone: Zone, _engine: Engine): Promise<boolean> => false // TODO: fix implementation
} as Condition;
