import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x1e,
	Arguments: [],
	Implementation: async (_: Instruction, engine: Engine, action: Action): Promise<Result> => {
		action.zone.solved = true;

		const worldLocation = engine.currentWorld.locationOfZone(action.zone);
		if (!worldLocation) console.warn("can find location of zone", action.zone, "on current world");
		const worldItem = engine.currentWorld.at(worldLocation);
		worldItem.zone.solved = true;

		return Result.Void;
	}
};
