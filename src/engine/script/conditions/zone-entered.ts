import Engine from "../../engine";
import { Zone } from "src/engine/objects";
import { int16 } from "../types";
import EvaluationMode from "../evaluation-mode";

export default {
	Opcode: 0x01,
	Arguments: [],
	Description: "Evaluates to true if hero just entered the zone",
	Implementation: async (_args: int16[], _: Zone, engine: Engine, mode: number): Promise<boolean> =>
		(mode & EvaluationMode.JustEntered) !== 0
};
