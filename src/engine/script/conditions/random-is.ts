import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x06;
export const Arguments = 1;
export const Description = "Current zone's `random` value is less equal to `arg_0`";
export default (args: int16[], zone: Zone, engine: Engine): boolean => zone.random === args[0];
