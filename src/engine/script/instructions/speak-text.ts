import Engine from "../../engine";
import { Point } from "src/util";
import { Result } from "../types";
import SpeechScene from "src/engine/scenes/speech-scene";

export default async (text: string, point: Point, engine: Engine): Promise<Result> => {
	const speechScene = new SpeechScene(engine);
	speechScene.text = text;
	speechScene.location = point;
	engine.sceneManager.pushScene(speechScene);

	return Result.UpdateText;
};
