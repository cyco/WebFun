import * as Result from '../result';

export default (instruction, engine, action) => {
	// original implementation disables action only if no redraw occurs
	action.enabled = false;
	return Result.OK;
};
