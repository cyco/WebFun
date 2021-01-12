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

import { ConditionImplementations as Conditions } from "../script/conditions";
import { InstructionImplementations as Instructions } from "../script/instructions";

import { Rectangle, Point, Size } from "src/util";

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
	SceneManager: (): SceneManager =>
		new SceneManager(() => new Rectangle(new Point(0, 0), new Size(0, 0))),
	AssetManager: (): AssetManager => new AssetManager(),
	ResourceManager: (): ResourceManager => new ResourceManager()
};
