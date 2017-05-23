export const Opcode = 0x13;
export const Arguments = 1;
export default (args, zone, engine) => engine.hero.health < args[0];
