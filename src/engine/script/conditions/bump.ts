import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "../condition";

export default <Condition>{
	Opcode: 0x02,
	Name: "bump",
	Arguments: [Type.Number, Type.Number, Type.Number],
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const state = engine.state;
		const bump = state.bump;
		if (!bump || bump.x !== args[0] || bump.y !== args[1]) {
			return false;
		}

		if (engine.currentZone.getTileID(args[0], args[1], 0) === args[2]) return true;
		if (engine.currentZone.getTileID(args[0], args[1], 1) === args[2]) return true;
		if (engine.currentZone.getTileID(args[0], args[1], 2) === args[2]) return true;

		return false;
	}
};

// TODO: validate against original implementation
/*
 case BUMP:
 if ( mode != 2
 || hero_x + relativeXMovment != condition->arg1
 || condition->arg2 != relativeYMovement + hero_y
 || zone->tile_ids[3 * (hero_x + relativeXMovment + 18 * (relativeYMovement + hero_y)) + 1] != condition->arg3 )
 {
 goto condition_NOT_satisfied;
 }
 break;
 */
