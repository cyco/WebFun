import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x11,
	Arguments: [],
	Description: "Show hero",
	Implementation: async (_instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.hero.visible = true;
		return Result.UpdateHero;
	}
};
