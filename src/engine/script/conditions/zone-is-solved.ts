import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x10,
	Arguments: [],
	Description: "True if the current zone is solved",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => zone.solved
};
