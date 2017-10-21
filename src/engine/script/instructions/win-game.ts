import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../arguments";

export const Opcode = 0x1f;
export const Arguments = -1;
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	throw "Game Won!";
};
