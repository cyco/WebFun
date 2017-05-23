export const Opcode = 0x1f;
export const Arguments = 1;
export default (args, zone, engine) => zone.counter !== args[0];
