import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x1e,
	Arguments: [],
	Description: "Determines if inventory contains any of the required items needed for current zone",
	Implementation: async (_: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const worldPosition = engine.currentWorld.locationOfZone(zone);
		const { requiredItem, additionalRequiredItem } = engine.currentWorld.at(worldPosition);

		return engine.inventory.contains(requiredItem) || engine.inventory.contains(additionalRequiredItem);
	}
};
