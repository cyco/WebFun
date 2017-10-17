import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x22;
export const Description = "Same as opcode 0x0a. Check if tile at `arg_0`x`arg_1`x`arg_2` is equal to `arg_3`";
export { default, Arguments } from "./tile-at-is";
