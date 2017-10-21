import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x19;
export const Arguments = 1;
export const Description = "Current zone's `padding` value is equal to `arg_0`";
export default (args: int16[], zone: Zone, engine: Engine): boolean => zone.padding === args[0];
