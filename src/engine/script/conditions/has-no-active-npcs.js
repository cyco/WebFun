export const Opcode = 0x0c;
export const Arguments = 0;
export default (args, zone, engine) => !zone.npcs.some((npc) => npc.charId !== -1); // TODO: might be npc.enabled