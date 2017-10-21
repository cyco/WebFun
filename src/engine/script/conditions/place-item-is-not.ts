import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x17;
export const Arguments = -1;
export default (args: int16[], zone: Zone, engine: Engine): boolean => false;
