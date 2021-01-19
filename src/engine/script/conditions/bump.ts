import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x02,
	Name: "bump",
	Arguments: [Type.Number, Type.Number, Type.TileID],
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const state = engine.temporaryState;
		const bump = state.bump;
		if (!bump || bump.x !== args[0] || bump.y !== args[1]) {
			return false;
		}

		if (zone.getTileID(args[0], args[1], 0) === args[2]) return true;
		if (zone.getTileID(args[0], args[1], 1) === args[2]) return true;
		if (zone.getTileID(args[0], args[1], 2) === args[2]) return true;

		return false;
	}
};

// TODO: validate against original implementation
/*
 case BUMP:
 if ( mode != 2
 || hero_x + relativeXMovement != condition->arg1
 || condition->arg2 != relativeYMovement + hero_y
 || zone->tile_ids[3 * (hero_x + relativeXMovement + 18 * (relativeYMovement + hero_y)) + 1] != condition->arg3 )
 {
 goto condition_NOT_satisfied;
 }
 break;
 */
