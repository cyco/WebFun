import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";
import GameState from "src/engine/game-state";
import { LoseScene } from "../../scenes";

import { Result } from "../types";

export default {
	Opcode: 0x20,
	Arguments: [],
	Implementation: async (_instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.gameState = GameState.Lost;
		engine.sceneManager.pushScene(new LoseScene());

		return Result.UpdateScene;
	}
};
