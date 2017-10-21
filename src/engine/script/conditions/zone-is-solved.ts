import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x10;
export const Arguments = -1;
export const Description = "True if the current zone is solved";
export default (args: int16[], zone: Zone, engine: Engine): boolean => zone.solved;
