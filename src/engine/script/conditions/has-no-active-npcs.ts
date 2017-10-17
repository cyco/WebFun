import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x0c;
export const Arguments = 0;
export default (args: int16[], zone: Zone, engine: Engine): boolean =>!zone.npcs.some((npc) => npc.id !== -1); // TODO: might be npc.enabled
