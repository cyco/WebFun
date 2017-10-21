import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x16;
export const Arguments = 1;
export const Description = "True the item provided by current zone is `arg_0`";
export default (args: int16[], zone: Zone, engine: Engine): boolean => zone.puzzleGain === args[0];
