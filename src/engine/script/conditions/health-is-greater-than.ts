import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x14;
export const Arguments = 1;
export const Description = "Hero's health is greater than `arg_0`.";
export default (args: int16[], zone: Zone, engine: Engine): boolean => engine.hero.health > args[0];
