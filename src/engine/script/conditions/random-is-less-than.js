export const Opcode = 0x08;
export const Arguments = 1;
export const Description = "Current zone's `random` value is less than `arg_0`";
export default (args, zone, engine) => zone.random < args[ 0 ];
