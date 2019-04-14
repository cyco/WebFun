import { Type, int16 } from "../types";

import Engine from "../../engine";
import GameState from "src/engine/game-state";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x12,
	Arguments: [Type.Number, Type.Number, Type.Number, Type.Number, Type.Number],
	Implementation: async (_: int16[], _2: Zone, engine: Engine): Promise<boolean> => {
		return engine.gameState === GameState.Won;
	}
};
