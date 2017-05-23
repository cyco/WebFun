export const Opcode = 0x1c;
export const Arguments = 1;
export default (args, zone, engine) => engine.persistentState.gamesWon === args[0];
