import * as Result from '../result';

export default (instruction, engine, action) => {
	engine.state.hero.visible = true;
	return Result.UpdateHero;
};