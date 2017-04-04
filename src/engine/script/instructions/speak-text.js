import SpeechScene from '/engine/scenes/speech-scene';
import * as Result from '../result';

export default (text, location, engine) => {
	const speechScene = new SpeechScene(engine);
	speechScene.text = text;
	speechScene.location = location;
	engine.sceneManager.pushScene(speechScene);

	return Result.UpdateText;
};
