import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";
import { Channel } from "src/engine/audio";
import { Sound } from "src/engine/objects";
import { NullIfMissing } from "src/engine/asset-manager";

export default {
	Opcode: 0x0a,
	Arguments: [Type.SoundID],
	Description: "Play sound specified by `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		const sound = engine.assetManager.get(Sound, instruction.arguments[0], NullIfMissing);
		engine.mixer.play(sound, Channel.Effect);
		return Result.Void;
	}
};
