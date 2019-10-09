import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";
import { WinScene } from "src/engine/scenes";
import GameState from "src/engine/game-state";

import { Result } from "../types";

export default {
	Opcode: 0x1f,
	Arguments: [],
	Implementation: async (_: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		engine.gameState = GameState.Won;

		const score = engine.persistentState.lastScore;
		engine.sceneManager.pushScene(new WinScene(score));
		return Result.UpdateScene;
	}
};
