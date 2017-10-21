import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x0d;
export const Arguments = 1;
export const Description = "True if inventory contains `arg_0`.\nIf `arg_0` is `-1` check if inventory contains the item provided by the current zone's puzzle";
export default (args: int16[], zone: Zone, engine: Engine): boolean => {
	const itemId = args[0] !== -1 ? args[0] : zone.puzzleGain;
	return engine.inventory.contains(itemId);
};
