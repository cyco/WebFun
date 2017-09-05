export const Opcode = 0x0f;
export const Arguments = 1;
export const Description = "True if `arg_0` is equal to current goal item id";
export default (args, zone, engine) => engine.story.goal.item_1 === args[ 0 ];
