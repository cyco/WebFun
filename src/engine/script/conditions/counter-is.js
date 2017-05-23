export const Opcode = 0x05;
export const Arguments = 1;
export default (args, zone, engine) => zone.counter === args[0];
