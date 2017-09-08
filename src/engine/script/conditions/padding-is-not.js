export const Opcode = 0x21;
export const Arguments = 1;
export const Description = "Current zone's `padding` value is not equal to `arg_0`";
export default (args, zone, engine) => zone.padding !== args[0];
