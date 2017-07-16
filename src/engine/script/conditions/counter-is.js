export const Opcode = 0x05;
export const Arguments = 1;
export const Description = 'Current zone\'s `counter` value is equal to `arg_0`';
export default (args, zone, engine) => zone.counter === args[0];
