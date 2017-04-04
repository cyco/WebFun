import * as Result from '../result';

export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const zone = engine.state.currentZone;
	
	const tile = engine.data.tiles[args[3]];
	zone.setTile(tile, args[0], args[1], args[2]);
	
	return Result.UpdateTiles;
};
