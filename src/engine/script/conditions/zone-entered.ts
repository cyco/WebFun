import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x01,
	Arguments: [],
	Description: "Evalutes to true if hero just entered the zone",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> =>
		engine.state.justEntered

	// TODO: validate against original implementation
	/*
	 case JUST_ENTERED:
	 if ( mode != JustEntered )
	 goto condition_NOT_satisfied,
	 */
};
