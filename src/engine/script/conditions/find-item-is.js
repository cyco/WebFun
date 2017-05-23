export const Opcode = 0x16;
export const Arguments = 1;
export default (args, zone, engine) => zone.puzzleGain === args[0];
