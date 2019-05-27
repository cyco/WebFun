import { Channel, Mixer } from "./audio";
import { Renderer } from "./rendering";
import { InputManager } from "./input";
import Metronome from "./metronome";
import Inventory from "./inventory";
import Engine from "./engine";
import { ScriptExecutor } from "./script";
import Hero from "./hero";
import SceneManager from "./scene-manager";
import Loader from "./loader";

import { ConditionImplementations as Conditions } from "./script/conditions";
import { InstructionImplementations as Instructions } from "./script/instructions";

interface Interface {
	Channel: () => Channel<HTMLAudioElement>;
	InputManager: (view: any) => InputManager;
	Inventory: () => Inventory;
	Metronome: () => Metronome;
	Renderer: (_: HTMLCanvasElement) => Renderer;
	ScriptExecutor: (
		engine: Engine,
		instructions: typeof Instructions,
		conditions: typeof Conditions
	) => ScriptExecutor;
	SceneManager: () => SceneManager;
	Hero: () => Hero;
	Loader: () => Loader;
	Mixer: (
		provider: (id: number) => HTMLAudioElement,
		musicChannel: Channel<HTMLAudioElement>,
		effectChannel: Channel<HTMLAudioElement>
	) => Mixer<HTMLAudioElement>;
}

export default Interface;
