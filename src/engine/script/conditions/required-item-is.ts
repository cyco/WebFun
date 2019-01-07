import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x0e,
	Arguments: [Type.TileID],
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const worldLocation = engine.currentWorld.locationOfZone(zone);
		if (!worldLocation) console.warn("can't find location of zone", zone, "on current world");
		const worldItem = engine.currentWorld.at(worldLocation);

		return args[0] === worldItem.requiredItem.id;
	}
};
