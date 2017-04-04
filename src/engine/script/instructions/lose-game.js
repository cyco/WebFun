import * as Result from '../result';

export default (instruction, engine, action) => {
	throw 'Game Lost!';
	engine.gameState = 'lost'; // TODO: use proper constants
	return Result.UpdateGameState;
};
