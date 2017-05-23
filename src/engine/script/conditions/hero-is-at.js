export const Opcode = 0x18;
export const Arguments = 2;
export default (args, zone, engine) => engine.hero.location.x === args[0] && engine.hero.location.y === args[1];
