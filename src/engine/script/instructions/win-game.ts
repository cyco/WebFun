import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import { WinScene } from "src/engine/scenes";

import { Result } from "../types";

export default {
	Opcode: 0x1f,
	Arguments: [],
	Implementation: async (_: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		engine.sceneManager.pushScene(new WinScene());
		return Result.UpdateScene;
	}
};
