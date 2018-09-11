import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";
import GameState from "src/engine/game-state";

export default <Condition>{
	Opcode: 0x12,
	Arguments: [Type.Number, Type.Number, Type.Number, Type.Number, Type.Number],
	Implementation: async (_: int16[], _2: Zone, engine: Engine): Promise<boolean> => {
		return engine.gameState === GameState.Won;
	}
};
