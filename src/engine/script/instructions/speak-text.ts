import SpeechScene from "src/engine/scenes/speech-scene";
import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Engine from "../../engine";
import Point from "../../../util/point";

export default (text: string, point: Point, engine: Engine): InstructionResult => {
	const speechScene = new SpeechScene(engine);
	speechScene.text = text;
	speechScene.location = point;
	engine.sceneManager.pushScene(speechScene);

	return Result.UpdateText;
};
