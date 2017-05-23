export const Opcode = 0x07;
export const Arguments = 1;
export default (args, zone, engine) => zone.random > args[0];
