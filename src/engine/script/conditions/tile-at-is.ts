import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x0a;
export const Arguments = 3;
export const Description = "Check if tile at `arg_0`x`arg_1`x`arg_2` is equal to `arg_3`";
export default (args: int16[], zone: Zone, engine: Engine): boolean => engine.currentZone.getTileID(args[1], args[2], args[3]) === args[0];
