import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x04;
export const Arguments = 3;
export const Description = "Check if hero is at `arg_0`x`arg_1` and the floor tile is `arg_2`";
export default (args: int16[], zone: Zone, engine: Engine): boolean => engine.hero.location.x === args[0] && engine.hero.location.y === args[1] && zone.getTileID(args[0], args[1], 0) === args[2];
