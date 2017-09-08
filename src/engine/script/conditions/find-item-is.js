export const Opcode = 0x16;
export const Arguments = 1;
export default (args, zone, engine) => zone.puzzleGain === args[0];
export const Description = "True the item provided by current zone is `arg_0`";
