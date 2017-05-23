export const Opcode = 0x0a;
export const Arguments = 3;
export default (args, zone, engine) => engine.currentZone.getTileID(args[1], args[2], args[3]) === args[0];
