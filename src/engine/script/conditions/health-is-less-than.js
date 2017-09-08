export const Opcode = 0x13;
export const Arguments = 1;
export const Description = "Hero's health is less than `arg_0`.";
export default (args, zone, engine) => engine.hero.health < args[0];
