export const Opcode = 0x07;
export const Arguments = 1;
export const Description = 'Current zone\'s `random` value is greater than `arg_0`';
export default (args, zone, engine) => zone.random > args[0];
