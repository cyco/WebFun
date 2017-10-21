import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x1a;
export const Arguments = 1;
export const Description = "Current zone's `padding` value is less than `arg_0`";
export default (args: int16[], zone: Zone, engine: Engine): boolean => zone.padding < args[0];
