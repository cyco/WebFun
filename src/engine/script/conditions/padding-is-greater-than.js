export const Opcode = 0x1b;
export const Arguments = 1;
export default (args, zone, engine) => zone.padding > args[0];
