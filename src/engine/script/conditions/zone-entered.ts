import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../types";

export default {
	Opcode: 0x01,
	Arguments: [],
	Description: "Evalutes to true if hero just entered the zone",
	Implementation: async (_args: int16[], _: Zone, engine: Engine): Promise<boolean> =>
		engine.temporaryState.justEntered

	// TODO: validate against original implementation
	/*
	 case JUST_ENTERED:
	 if ( mode != JustEntered )
	 goto condition_NOT_satisfied,
	 */
};
