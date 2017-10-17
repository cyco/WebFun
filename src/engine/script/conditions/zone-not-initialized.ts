import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x00;
export const Arguments = -1;
export const Description = "Evaluates to true exactly once (used for initialization)";
export default (args: int16[], zone: Zone, engine: Engine): boolean => !engine.currentZone.actionsInitialized;
