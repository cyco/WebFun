import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x0a,
	Arguments: [Type.SoundID],
	Description: "Play sound specified by `arg_0`",
	Implementation: async (_instruction: Instruction, _engine: Engine, _action: Action): Promise<Result> => {
		// engine.mixer.playEffect(engine.data.sounds[args[0]]);
		return ResultFlags.UpdateSound;
	}
};
