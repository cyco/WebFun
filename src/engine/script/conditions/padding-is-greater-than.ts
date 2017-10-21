import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x1b;
export const Arguments = 1;
export const Description = "Current zone's `padding` value is greater than `arg_0`";
export default (args: int16[], zone: Zone, engine: Engine): boolean => zone.padding > args[0];
