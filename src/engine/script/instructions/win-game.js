import * as Result from '../result';

export default (instruction, engine, action) => {
	throw 'Game Won!';
	engine.gameState = 'won'; // TODO: use proper constants
	return Result.UpdateGameState;
};
