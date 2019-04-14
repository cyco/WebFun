import { Type, int16 } from "../types";

import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x15,
	Arguments: [Type.Number, Type.Number, Type.Number, Type.Number, Type.Number],
	Implementation: async (_args: int16[], _zone: Zone, _: Engine): Promise<boolean> => false
};
