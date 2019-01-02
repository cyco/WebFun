import SpeechScene from "src/engine/scenes/speech-scene";
import { Point } from "src/util";
import Engine from "../../engine";
import { Result } from "../types";

export default async (text: string, point: Point, engine: Engine): Promise<Result> => {
	const speechScene = new SpeechScene(engine);
	speechScene.text = text;
	speechScene.location = point;
	engine.sceneManager.pushScene(speechScene);

	return Result.UpdateText;
};
