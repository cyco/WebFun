import Engine from "../../engine";
import { Action, Instruction, Zone } from "src/engine/objects";

import { Result } from "../types";
import { Point, Direction } from "src/util";

export default {
	Opcode: 0x1a,
	Arguments: [],
	Description: "Disable all monsters",
	Implementation: async (_: Instruction, _engine: Engine, action: Action): Promise<Result> => {
		const zone = action.zone;

		zone.monsters.forEach(monster => {
			const position = new Point(monster.position.x, monster.position.y, Zone.Layer.Object);
			const currentTile = zone.getTile(position);
			if (currentTile && currentTile === monster.face.getFace(Direction.South, -1)) {
				zone.setTile(null, position);
			} else {
			}
			monster.enabled = false;
		});

		return Result.Void;
	}
};
