import Engine from "../../engine";
import { Zone } from "src/engine/objects";
import { int16 } from "../types";
import EvaluationMode from "../evaluation-mode";

export default {
	Opcode: 0x09,
	Arguments: [],
	Implementation: async (
		_: int16[],
		_zone: Zone,
		_engine: Engine,
		mode: EvaluationMode
	): Promise<boolean> => (mode & EvaluationMode.ByPlane) !== 0
};
