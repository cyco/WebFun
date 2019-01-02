import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x00,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.ZoneZ, Type.TileID],
	Description: "Place tile `arg_3` at `arg_0`x`arg_1`x`arg_2`. To remove a tile the id -1 is used.",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;
		const zone = engine.currentZone;

		const tile = engine.data.tiles[args[3]];
		zone.setTile(tile, args[0], args[1], args[2]);

		return Result.UpdateTiles;
	}
};
