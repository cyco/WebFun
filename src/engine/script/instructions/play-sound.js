import * as Result from "../result";

export default (instruction, engine, action) => {
	const args = instruction.arguments;
	engine.mixer.playEffect(engine.data.sounds[args[0]]);
	return Result.UpdateSound;
};
