import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x10,
	Arguments: [],
	Description: "Hide hero",
	Implementation: async (_: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		engine.hero.visible = false;
		return ResultFlags.UpdateHero;
	}
};
