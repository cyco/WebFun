export const Opcode = 0x04;
export const Arguments = 3;
export const Description = 'Check if hero is at `arg_0`x`arg_1` and the floor tile is `arg_2`';
export default (args, zone, engine) => engine.hero.location.x === args[0] && engine.hero.location.y === args[1] && zone.getTileID(args[0], args[1], 0) === args[2];

// TODO: validate against original implementation
/* case STANDS_ON:
                if ( mode != 1
                  || condition->arg1 != hero_x
                  || condition->arg2 != hero_y
                  || zone->tile_ids[3 * (hero_x + 18 * hero_y)] != condition->arg3 )
                {
                  goto condition_NOT_satisfied;
                }
                break;
*/
