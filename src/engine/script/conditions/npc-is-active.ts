import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x0b;
export const Arguments = 1;
export const Description = "True if npc `arg_0` is alive and well.";
export default (args: int16[], zone: Zone, engine: Engine): boolean => args[0] >= 0 && args[0] <= zone.npcs.length && zone.npcs[args[0]] && zone.npcs[args[0]].id !== -1; // TODO: might be npc.enabled
