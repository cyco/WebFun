import { Mixer } from "./audio";
import { Renderer } from "./rendering";
import { InputManager } from "./input";
import { ScriptProcessingUnit } from "./script";
import AssetManager from "./asset-manager";
import Engine from "./engine";
import Hero from "./hero";
import Inventory from "./inventory";
import Metronome from "./metronome";
import ResourceManager from "./resource-manager";
import SceneManager from "./scene-manager";

import { ConditionImplementations as Conditions } from "./script/conditions";
import { InstructionImplementations as Instructions } from "./script/instructions";
import Logger from "./logger";
import { Point } from "src/util";

interface Interface {
	InputManager: (view: any) => InputManager;
	Inventory: () => Inventory;
	Metronome: () => Metronome;
	Renderer: (_: HTMLCanvasElement) => Renderer;
	ScriptProcessingUnit: (
		engine: Engine,
		instructions: typeof Instructions,
		conditions: typeof Conditions
	) => ScriptProcessingUnit;
	SceneManager: () => SceneManager;
	Hero: () => Hero;
	Mixer: () => Mixer;
	AssetManager: () => AssetManager;
	ResourceManager: () => ResourceManager;
	Logger: () => Logger;
	ShowText: (text: string, at: Point) => Promise<void>;
	ShowDebugStatusInfo: (engine: Engine) => void;
}

export default Interface;
