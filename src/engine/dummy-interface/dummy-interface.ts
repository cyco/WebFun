import InputManager from "./input-manager";
import Renderer from "./renderer";
import Metronome from "../metronome";
import Inventory from "../inventory";
import Engine from "../engine";
import { ScriptProcessingUnit } from "../script";
import Hero from "../hero";
import Mixer from "./mixer";
import SceneManager from "../scene-manager";
import AssetManager from "../asset-manager";
import ResourceManager from "./resource-manager";
import Logger from "./logger";

import { ConditionImplementations as Conditions } from "../script/conditions";
import { InstructionImplementations as Instructions } from "../script/instructions";

export default {
	Metronome: (): Metronome => new Metronome(),
	Inventory: (): Inventory => new Inventory(),
	ScriptProcessingUnit: (
		engine: Engine,
		instructions: typeof Instructions,
		conditions: typeof Conditions
	): ScriptProcessingUnit => new ScriptProcessingUnit(engine, instructions, conditions),
	Hero: (): Hero => new Hero(),
	Mixer: (): Mixer => new Mixer(),
	InputManager: (): InputManager => new InputManager(),
	Renderer: (): Renderer => new Renderer(),
	SceneManager: (): SceneManager => new SceneManager(),
	AssetManager: (): AssetManager => new AssetManager(),
	ResourceManager: (): ResourceManager => new ResourceManager(),
	Logger: (): Logger => new Logger(),
	ShowText: (): Promise<void> => Promise.resolve()
};
