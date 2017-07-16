export const Opcode = 0x10;
export const Arguments = -1;
export const Description = "True if the current zone is solved";
export default (args, zone, engine) => zone.solved;
