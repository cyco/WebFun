import SpeechScene from "src/engine/scenes/speech-scene";
import Point from "../../../util/point";
import Engine from "../../engine";

import { Result, ResultFlags } from "../arguments";

export default (text: string, point: Point, engine: Engine): Result => {
	const speechScene = new SpeechScene(engine);
	speechScene.text = text;
	speechScene.location = point;
	engine.sceneManager.pushScene(speechScene);

	return ResultFlags.UpdateText;
};
