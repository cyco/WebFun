import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../types";

export default {
	Opcode: 0x1e,
	Arguments: [],
	Description: "Determines if inventory contains any of the required items needed for current zone",
	Implementation: async (_: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const { requiredItem, additionalRequiredItem } = engine.currentWorld.itemForZone(zone);

		return engine.inventory.contains(requiredItem) || engine.inventory.contains(additionalRequiredItem);
	}
};
