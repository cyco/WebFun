export const Opcode = 0x1b;
export const Arguments = 1;
export const Description = "Current zone's `padding` value is greater than `arg_0`";
export default (args, zone, engine) => zone.padding > args[ 0 ];
