import { Action, Instruction, Zone } from "../objects";

import Engine from "../engine";
import EvaluationMode from "./evaluation-mode";

type int16 = number;

export type ConditionImplementation = (
	args: int16[],
	zone: Zone,
	engine: Engine,
	mode: EvaluationMode
) => Promise<boolean>;

export type InstructionImplementation = (
	instruction: Instruction,
	engine: Engine,
	action: Action
) => Promise<Result>;

enum Result {
	Void = 0,
	UpdateText = 1 << 0,
	UpdateZone = 1 << 1,
	Wait = 1 << 2,
	UpdateScene = 1 << 3
}

enum ScriptResult {
	Void = 0,
	UpdateText = 1 << 0,
	UpdateZone = 1 << 1,
	Wait = 1 << 2,
	UpdateScene = 1 << 3,

	Done = 1 << 10
}

class Type {
	public static readonly Number = new Type();
	public static readonly TileID = new Type();
	public static readonly ZoneX = new Type();
	public static readonly ZoneY = new Type();
	public static readonly ZoneZ = new Type();
	public static readonly MonsterId = new Type();
	public static readonly ZoneID = new Type();
	public static readonly HotspotID = new Type();
	public static readonly SoundID = new Type();
	public static readonly Unused = new Type();
}

export { int16, Result, Type, ScriptResult };
