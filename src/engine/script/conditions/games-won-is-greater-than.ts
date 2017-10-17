import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x23;
export const Arguments = 1;
export const Description = "Total games won is greater than `arg_0`";
export default (args: int16[], zone: Zone, engine: Engine): boolean => engine.persistentState.gamesWon > args[0];
