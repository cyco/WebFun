import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";

export const Opcode = 0x1c;
export const Arguments = 1;
export const Description = "Total games won is equal to `arg_0`";
export default (args: int16[], zone: Zone, engine: Engine): boolean => engine.persistentState.gamesWon === args[0];
