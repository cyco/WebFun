import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x0d,
	Arguments: [Type.TileID],
	Description:
		"True if inventory contains `arg_0`.\nIf `arg_0` is `-1` check if inventory contains the item provided by the current zone's puzzle",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		// TODO: fix implementation
		// const itemId = args[0] !== -1 ? args[0] : zone.puzzleGain;
		const itemId = args[0] !== -1 ? args[0] : -1;
		return engine.inventory.contains(itemId);
	}
};
