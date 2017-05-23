export const Opcode = 0x0d;
export const Arguments = 1;

export default (args, zone, engine) => {
	const itemId = args[0] !== -1 ? args[0] : zone.puzzleGain;
	return engine.inventory.contains(itemId);
};
