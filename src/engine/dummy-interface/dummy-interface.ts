import InputManager from "./input-manager";
import Renderer from "./renderer";
import Metronome from "../metronome";
import Inventory from "../inventory";
import Engine from "../engine";
import { ScriptExecutor } from "../script";
import Hero from "../hero";
import Loader from "./loader";
import Mixer from "./mixer";
import SceneManager from "../scene-manager";
import AssetManager from "../asset-manager";
import ResourceManager from "./resource-manager";

import { ConditionImplementations as Conditions } from "../script/conditions";
import { InstructionImplementations as Instructions } from "../script/instructions";

import { Rectangle, Point, Size } from "src/util";

export default {
	Metronome: () => new Metronome(),
	Inventory: () => new Inventory(),
	ScriptExecutor: (engine: Engine, instructions: typeof Instructions, conditions: typeof Conditions) =>
		new ScriptExecutor(engine, instructions, conditions),
	Hero: () => new Hero(),
	Mixer: () => new Mixer(),
	InputManager: () => new InputManager(),
	Renderer: () => new Renderer(),
	Loader: () => new Loader(),
	SceneManager: () => new SceneManager(() => new Rectangle(new Point(0, 0), new Size(0, 0))),
	AssetManager: () => new AssetManager(),
	ResourceManager: () => new ResourceManager()
};
