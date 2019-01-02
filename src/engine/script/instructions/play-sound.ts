import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x0a,
	Arguments: [Type.SoundID],
	Description: "Play sound specified by `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		engine.mixer.effectChannel.playSound(instruction.arguments[0]);
		return Result.UpdateSound;
	}
};
