import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x13;
export const Arguments = 1;
export const Description = "Hero's health is less than `arg_0`.";
export default (args: int16[], zone: Zone, engine: Engine): boolean =>engine.hero.health < args[0];
