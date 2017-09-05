export const Opcode = 0x23;
export const Arguments = 1;
export const Description = "Total games won is greater than `arg_0`";
export default (args, zone, engine) => engine.persistentState.gamesWon > args[ 0 ];
