import SpeechScene from "src/engine/scenes/speech-scene";
import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	const speechScene = new SpeechScene(engine);
	speechScene.text = instruction.text;
	speechScene.location = location;
	engine.sceneManager.pushScene(speechScene);

	return Result.UpdateText;
};
