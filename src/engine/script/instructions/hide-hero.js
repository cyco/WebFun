import * as Result from '../result';

export default (instruction, engine, action) => {
	engine.state.hero.visible = false;
	return Result.UpdateHero;
};
