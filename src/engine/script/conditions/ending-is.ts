import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x0f;
export const Arguments = 1;
export const Description = "True if `arg_0` is equal to current goal item id";
export default (args: int16[], zone: Zone, engine: Engine): boolean => engine.story.goal.item1.id === args[0];
