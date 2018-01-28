import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x00,
	Arguments: [],
	Description: "Evaluates to true exactly once (used for initialization)",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> =>
		!engine.currentZone.actionsInitialized
};
