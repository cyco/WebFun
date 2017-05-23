export const Opcode = 0x21;
export const Arguments = 1;
export default (args, zone, engine) => zone.padding !== args[0];
