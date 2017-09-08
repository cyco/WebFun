export const Opcode = 0x1c;
export const Arguments = 1;
export const Description = "Total games won is equal to `arg_0`";
export default (args, zone, engine) => engine.persistentState.gamesWon === args[0];
