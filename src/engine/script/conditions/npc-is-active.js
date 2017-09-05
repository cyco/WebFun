export const Opcode = 0x0b;
export const Arguments = 1;
export const Description = "True if npc `arg_0` is alive and well.";
export default (args, zone, engine) => args[ 0 ] >= 0 && args[ 0 ] <= zone.npcs.length && zone.npcs[ args[ 0 ] ] && zone.npcs[ args[ 0 ] ].charId !== -1; // TODO: might be npc.enabled
